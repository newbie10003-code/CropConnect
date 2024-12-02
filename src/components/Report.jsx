import React, { useState, useEffect } from 'react';
const Report = () => {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://cropconnect-48a7.onrender.com/user`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
    
                if (response.ok) {
                    setUser(data.user);
                    setReports(data.reports || []);
                } else {
                    console.error('Error fetching user details:', data.message);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserDetails();
    }, []);
    
    const deleteReport = async (id) => {
      const confirmed = window.confirm('Are you sure you want to delete this report?');
      if (!confirmed) return;
    
      try {
        const response = await fetch(`http://127.0.0.1:5001/delete_reports/${id}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          setReports((prevReports) => prevReports.filter((report) => report.id !== id));
        } else {
          console.error('Failed to delete report:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    };
    
    const downloadReport = async (report_id) => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/download_report/${report_id}`, {
          method: 'GET',
        });
    
        if (!response.ok) {
          console.error('Failed to download report:', response.statusText);
        } else {
          // Handle the report download successfully
          const blob = await response.blob();
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `report_${report_id}.pdf`;
          link.click();
          URL.revokeObjectURL(downloadUrl); // Clean up the object URL
        }
      } catch (error) {
        console.error('Error downloading report:', error);
      }
    };
    
  return (
    <div className={`down centered`} style={{paddingBottom:'5.5rem'}}>
    <div className="Letter" >
      
      <div className="side">
    <div className="blog-table">
      <h1>Reports History</h1>
      {reports.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Description</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{"Report_" + report.id}</td>
                <td>{report.type}</td>
                <td>{report.date}</td>
                <td style={{display:'flex', justifyContent:'space-evenly'}}>
                  <button onClick={() => deleteReport(report.id)}>Delete</button>
                  <button onClick={() => downloadReport(report.id)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Reports yet.</p>
      )}
    </div>
    </div>
    </div>
    <div className="side">
      </div>
    </div>
  )
}

export default Report
