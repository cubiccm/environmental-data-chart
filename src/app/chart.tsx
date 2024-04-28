import "./chart.scss";
import "@material/web/labs/card/elevated-card.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { useRef, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";

import { MdSwitch } from "@material/web/switch/switch.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip
);

export function Chart({
  chart_data,
  chart_title,
  type,
  begin_at_zero,
}: {
  chart_data: any;
  chart_title: string;
  type: string;
  begin_at_zero: boolean;
}) {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: begin_at_zero,
      },
    },
  };

  return (
    <md-elevated-card class="chart__card">
      <span className="chart__title">{chart_title}</span>
      {type == "bar" && <Bar options={options} data={chart_data} />}
      {type == "line" && <Line options={options} data={chart_data} />}
    </md-elevated-card>
  );
}

export default function ChartList({
  data,
  type = "bar",
  begin_at_zero = false,
}: {
  data: any;
  type: string;
  begin_at_zero: boolean;
}) {
  const charts = data.map((chart: any) => (
    <Chart
      chart_data={chart.data}
      chart_title={chart.title}
      type={type}
      begin_at_zero={begin_at_zero}
      key={chart.title}
    />
  ));

  return <div className="chart__wrapper">{charts}</div>;
}

export function ChartOptions({
  type_handler,
  begin_at_zero_handler
}: {
  type_handler: Function;
  begin_at_zero_handler: Function;
}) {
  const begin_at_zero_switch = useRef(null);
  const chart_type_select = useRef(null);
  
  useEffect(() => {
    if (begin_at_zero_switch.current != null) {
      (begin_at_zero_switch.current as MdSwitch)?.addEventListener("change", (e) => {
        begin_at_zero_handler((e.target as MdSwitch).selected);
      }, {
        once: true
      });
    }
    if (chart_type_select != null) {
      (chart_type_select.current as MdOutlinedSelect)?.addEventListener("change", (e) => {
        type_handler((e.target as MdOutlinedSelect).value);
        console.log((e.target as MdOutlinedSelect).value);
      }, {
        once: true
      });
    }
  });
  
  return (
    <div className="chart__options">
      <md-outlined-select ref={chart_type_select}>
        <md-select-option selected value="bar">
          <div slot="headline">Bar Chart</div>
        </md-select-option>
        <md-select-option value="line">
          <div slot="headline">Line Chart</div>
        </md-select-option>
      </md-outlined-select>
      <label>
        Y-Axis Begins at Zero
        <md-switch icons ref={begin_at_zero_switch}></md-switch>
      </label>
    </div>
  );
}
