import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./Sidebar";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalCampaigns: 0,
    totalEmailsSent: 0,
    averageEngagementRate: 0,
    totalNewLeads: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Get the token from localStorage
        const token = localStorage.getItem("token");
  
        if (!token) {
          setError("No authentication token found");
          navigate("/"); // Redirect to login if no token
          return;
        }
  
        // Make the API request
        const response = await axios.get("https://musician-email-backend-08dfa4e34da5.herokuapp.com/api/endpoint", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
            "Content-Type": "application/json",
          },
        });
  
        // Update the dashboard state with response data
        if (response.data) {
          setSummary({
            totalCampaigns: Number(response.data.totalCampaigns) || 0,
            totalEmailsSent: Number(response.data.totalEmailsSent) || 0,
            averageEngagementRate: Number(response.data.averageEngagementRate) || 0,
            totalNewLeads: Number(response.data.totalNewLeads) || 0,
          });
        } else {
          throw new Error("Invalid response data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.error || "Failed to fetch dashboard data");
        if (err.response?.status === 401) {
          navigate("/"); // Redirect to login if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);
  

  // Example graph data based on summary
  const graphData = [
    {
      month: "Jan",
      emails: summary.totalEmailsSent,
      campaigns: summary.totalCampaigns,
    },
    {
      month: "Feb",
      emails: Math.round(summary.totalEmailsSent * 0.8),
      campaigns: Math.round(summary.totalCampaigns * 0.8),
    },
    {
      month: "Mar",
      emails: Math.round(summary.totalEmailsSent * 0.6),
      campaigns: Math.round(summary.totalCampaigns * 0.6),
    },
    {
      month: "Apr",
      emails: Math.round(summary.totalEmailsSent * 0.4),
      campaigns: Math.round(summary.totalCampaigns * 0.4),
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        <div className="dashboard-cards">
          <div className="card-item">
            <div className="card-number">{summary.totalCampaigns}</div>
            <div className="card-title">Total Campaigns</div>
          </div>
          <div className="card-item">
            <div className="card-number">{summary.totalEmailsSent}</div>
            <div className="card-title">Emails Sent</div>
          </div>
          <div className="card-item">
            <div className="card-number">{summary.averageEngagementRate}%</div>
            <div className="card-title">Engagement Rate</div>
          </div>
          <div className="card-item">
            <div className="card-number">{summary.totalNewLeads}</div>
            <div className="card-title">New Leads</div>
          </div>
        </div>

        <div className="dashboard-graph">
          <h3>Email & Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="emails"
                stroke="#8884d8"
                name="Emails Sent"
              />
              <Line
                type="monotone"
                dataKey="campaigns"
                stroke="#82ca9d"
                name="Campaigns"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
