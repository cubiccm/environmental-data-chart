"use client";

import { useState } from "react";
import { read, WorkSheet } from "xlsx";
import '@material/web/switch/switch.js';
import '@material/web/button/filled-button.js';
import '@material/web/icon/icon.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import ChartList, { ChartOptions } from "./chart";
import FileUploader from "./fileuploader";

export default function Home() {
  const [chartData, setChartData] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [beginAtZero, setBeginAtZero] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [errorMessage, setErrorMessage] = useState("");

  const importData = (sheet: WorkSheet) => {
    const month_labels = [];
    for (let col = "B".charCodeAt(0); col <= "M".charCodeAt(0); col++) {
      month_labels.push(sheet[`${String.fromCharCode(col)}1`].w);
    }

    let chart_data_list = [];
    for (let row = 2; row <= 8; row++) {
      const chart_title = sheet[`A${row}`].v;
      let row_data = [];
      for (let col = "B".charCodeAt(0); col <= "M".charCodeAt(0); col++) {
        row_data.push(sheet[`${String.fromCharCode(col)}${row}`].v);
      }
      const chart_data = {
        labels: month_labels,
        datasets: [{
          label: chart_title,
          data: row_data,
          backgroundColor: "hsla(" + ((row - 2) * (360 / 7) % 360) + ", 75%, 50%, 0.5)",
          borderColor: "hsla(" + ((row - 2) * (360 / 7) % 360) + ", 75%, 65%, 1)",
          borderWidth: 1,
        }]
      };
      chart_data_list.push({
        title: chart_title,
        data: chart_data
      })
    }
    setChartData(chart_data_list as any);
  };

  const handleFile = (file: File) => {
    file?.arrayBuffer().then((data) => {
      try {
        setErrorMessage("");
        const workbooks = read(data);
        for (const sheet_name in workbooks.Sheets) {
          const sheet_data = workbooks.Sheets[sheet_name];
          importData(sheet_data);
        }
        setHasFile(true);
      } catch {
        setHasFile(false);
        setErrorMessage("Failed to process selected file");
      }
    });
  }

  if (hasFile) return (
    <>
      <ChartOptions type_handler={setChartType} begin_at_zero_handler={setBeginAtZero} />
      <ChartList data={chartData} type={chartType} begin_at_zero={beginAtZero} />
    </>
  );
  else return (
    <FileUploader callback={handleFile} error_message={errorMessage} />
  );
}
