import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Charts = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("role");
        const endpoint =
          userType === "startup"
            ? "http://localhost:10000/startupChart"
            : "http://localhost:10000/mentorChart";

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { months, jobCounts } = response.data;

        const formattedLabels = months.map((month) => {
          const date = new Date(month);
          return date.toLocaleDateString("en-US", { month: "short" });
        });

        const chartData = {
          labels: formattedLabels,
          datasets: [
            {
              label: "Accepted Jobs",
              data: jobCounts,
              borderColor: "#696CFF",
              tension: 0.4,
              pointRadius: 0,
              fill: false,
            },
          ],
        };

        setData(chartData);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 0,
    },
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          stepSize: 5,
        },
        grid: {
          display: true,
          color: "#e0e0e0",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div
      className={
        localStorage.getItem("role") === "startup" ? "bestMentorsMenu" : "chart"
      }
      style={{ height: "360px", width: "500px", marginRight: "100px" }}
    >
      <h3 className="dashboardTitle">
        {localStorage.getItem("role") === "startup"
          ? "Overall Statistics"
          : "Performance Over Time"}
      </h3>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          height: "71%",
          width: "90%",
          borderRadius: "25px",
          padding: "30px",
        }}
      >
        <div
          className="chartContainer"
          style={{
            height: "300px",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          {data.labels.length > 0 && data.datasets.length > 0 ? (
            <Line data={data} options={options} />
          ) : (
            <div className="jobCardSmall applicationInfoContainer flexRow alignCenter justifyCenter">
              <p className="loginTitle"> No chart data yet. </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
