/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  isUserLoggedIn,
  saveCurrentCompany,
} from "../utils/UserUtils";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { FirstDataRenderedEvent } from "ag-grid-community";
import { GridButton } from "../components/GridButton";
import { Select } from "@material-ui/core";

export function Dashboard() {
  const history = useHistory();
  const [companyData, setCompanyData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [defaultRowData, setDefaultRowData] = useState([]);
  const [changed, setChanged] = useState(0);
  const [gridApi, setGridApi] = useState<any>(null);
  const [currencyCodes, setCurrencyCodes] = useState(["USD","GBP","LKR","EUR","SGD","JPY",]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [openDialog, setOpenDialog] = useState(false);

  const [columnDefs] = useState([
    { field: "name", headerName: "Company Name" },
    { field: "symbol", headerName: "Company Code" },
    { field: "availShares", headerName: "Unissued Shares" },
    { field: "currency", headerName: "Currency" },
    { field: "price", headerName: "Price Per Share" },
    { field: "lastUpdated", headerName: "Last Updated Date" },
    {
      field: "buy",
      headerName: "Buy",
      cellRenderer: "gridButton",
      cellRendererParams: {
        clicked: function (field: any) {
          saveCurrentCompany({ ...field, type: "buy" });
          history.push("/trade");
        },
        type: "buy",
      },
    },
    // { field: "ownedShares", headerName: "Owned Shares" },
    {
      field: "sell",
      headerName: "Sell",
      cellRenderer: "gridButton",
      cellRendererParams: {
        clicked: function (field: any) {
          saveCurrentCompany({ ...field, type: "sell" });
          history.push("/trade");
        },
        type: "sell",
      },
    },
  ]);

  useEffect(() => {
    const isLoggedIn = isUserLoggedIn();
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [history]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://localhost:8081/company/get-all", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data)
      });

  }, []);

  useEffect(() => {
    if (companyData.length > 0) {
      const tempData = [...companyData];
      tempData.forEach((row: any) => {
        row["pricePerShareInUSD"] = row["pricePerShare"];
      });
      setDefaultRowData(tempData);
      setRowData(tempData);
      setChanged(changed + 1);
    }
  }, [companyData]);

  useEffect(() => {
    if (rowData.length > 0 && gridApi) {
      gridApi.redrawRows();
    }
  }, [rowData]);

  useEffect(() => {
    if (rowData.length > 0) {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch(
        `http://localhost:8081/currency/get-by-symbol/${selectedCurrency}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          const tempData = [...defaultRowData];
          tempData.forEach((row: any) => {
            row["currency"] = selectedCurrency;
            row["price"] = (
              row["price"] * parseFloat(data["rate"])
            ).toFixed(2);
          });
          setRowData(tempData);
          setChanged(changed + 1);
        });
    }
  }, [selectedCurrency]);

  const onFirstDataRendered = (event: FirstDataRenderedEvent) => {
    event.api.sizeColumnsToFit();
    setGridApi(event.api);
  };



  let selectCurrencyValues =
    currencyCodes &&
    currencyCodes.map((currency: string) => {
      return <option value={currency}>{currency}</option>;
    });

  const handleCurrencyChange = (event: any) => {
    setSelectedCurrency(event.target.value);
  };




  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <AdvanceSearchDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          search={handleAdvanceSearch}
        />
        <h1 style={{marginLeft: 20}}>Welcome {isUserLoggedIn()}!</h1>
        <Button
          variant="contained"
          style={{ margin: 20 }}
          onClick={handleViewTransaction}
        >
          View My Transactions
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          style={{ margin: 20 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div> */}

      

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: 20,
          alignItems: "center",
        }}
      >
        
        <Select value={selectedCurrency} onChange={handleCurrencyChange}>
          {selectCurrencyValues}
        </Select>
      </div>
      <div
        className="ag-theme-alpine-dark"
        style={{ height: 600, width: "auto", margin: 20 }}
      >
        <AgGridReact
          defaultColDef={{
            resizable: true,
            filter: "agMultiColumnFilter",
            floatingFilter: false,
            headerCheckboxSelectionFilteredOnly: true,
            editable: false,
            sortable: true,
          }}
          enableCellChangeFlash={true}
          statusBar={{
            statusPanels: [
              {
                statusPanel: "agAggregationComponent",
                statusPanelParams: {
                  aggFuncs: ["sum", "avg", "count"],
                },
                align: "left",
              },
            ],
          }}
          frameworkComponents={{
            gridButton: GridButton,
          }}
          sideBar={{
            toolPanels: ["columns", "filters"],
          }}
          rowSelection="single"
          rowData={rowData}
          columnDefs={columnDefs}
          onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  );
}

