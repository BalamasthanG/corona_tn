import React from 'react';
import './App.css';
import Table from 'react-bootstrap/Table'
import { Header, Segment, Icon } from 'semantic-ui-react';


class App extends React.Component {


  state = {
    district: null,
    tnReport: null,
    curTime: new Date().toLocaleString()
  };

  componentDidMount() {
    this.tnReportTable();
  }

  tnReportTable = () => {

    fetch('https://api.covid19india.org/data.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          tnReport: response.statewise[response.statewise.findIndex(p => p.statecode === "TN")]
        });
      });

    fetch('https://api.covid19india.org/state_district_wise.json')
      .then(response => response.json())
      .then(response => {
        this.setState({
          district: response['Tamil Nadu'].districtData
        });
      });

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let separator = '-';
    this.setState({
      curTime: `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
    })
  }

  districtDataList = (district) => {

    const result = Object.keys(district).map(key =>
      <div key={key.toString()}>
        <Header as="h3">{key}</Header>
        <Table striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th>{this.state.curTime}</th>
              <th>Confirmed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{district[key].delta.confirmed}</td>
              <td>{district[key].confirmed}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
    return result;

  }


  render() {
    const { tnReport, curTime, district } = this.state;
    return (
      <div>
        <Segment>
          <Header as="h2">Tamil Nadu Corona Report</Header>
          <Table striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th>{curTime}</th>
                <th>Confirmed</th>
                <th>Active</th>
                <th>Recovered</th>
                <th>Deceased</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tnReport && tnReport.deltaconfirmed}</td>
                <td>{tnReport && tnReport.confirmed}</td>
                <td>{tnReport && tnReport.active}</td>
                <td>{tnReport && tnReport.recovered}</td>
                <td>{tnReport && tnReport.deaths}</td>
              </tr>
            </tbody>
          </Table>
          <Header as="h2"><Icon name="users" color="red" />District wise Report</Header>
          {district && this.districtDataList(district)}
        </Segment>
        <footer style={{ textAlign: "center"}}>App by BmG</footer>
      </div>
    );
  }
}

export default App;
