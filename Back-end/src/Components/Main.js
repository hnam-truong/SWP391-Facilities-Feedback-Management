import React, { Component } from 'react'
import { filmData, reportData } from '../Shared/ListOfReport'
import ReportPresentaion from './Content/ReportPre'

export class Main extends Component {
  constructor() {
    super();
    this.state = {
      reports: reportData
    };
  }
  render() {
    return <ReportPresentaion reports={this.state.reports} />
  }
}
export default Main
