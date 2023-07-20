// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge/index'
import VaccinationByGender from '../VaccinationByGender/index'
import VaccinationCoverage from '../VaccinationCoverage/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationByAgeList: [],
    vaccinationByGenderList: [],
    vaccinationCoverageList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(`https://apis.ccbp.in/covid-vaccination-data`)

    if (response.ok) {
      const responseData = await response.json()
      const formattedData = responseData.last_7_days_vaccination.map(
        eachData => ({
          vaccineDate: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        }),
      )
      this.setState({
        vaccinationByAgeList: responseData.vaccination_by_age,
        vaccinationByGenderList: responseData.vaccination_by_gender,
        vaccinationCoverageList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {
      vaccinationByAgeList,
      vaccinationByGenderList,
      vaccinationCoverageList,
    } = this.state

    return (
      <>
        <div className="category-container">
          <h1 className="container-heading">Vaccination Coverage</h1>
          <VaccinationCoverage
            vaccinationCoverageList={vaccinationCoverageList}
          />
        </div>

        <div className="category-container">
          <h1 className="container-heading">Vaccination by gender</h1>
          <VaccinationByGender
            vaccinationByGenderList={vaccinationByGenderList}
          />
        </div>
        <div className="category-container">
          <h1 className="container-heading">Vaccination by age</h1>
          <VaccinationByAge vaccinationByAgeList={vaccinationByAgeList} />
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure view"
          className="failure-view-img"
        />
        <h1 className="error-msg">Something went wrong</h1>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-bg-container">
        <div className="cowin-dashboard-container">
          <div className="cowin-title-card">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="cowin-logo"
            />
            <h1 className="cowin-title">Co-WIN</h1>
          </div>
          <h1 className="main-heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetailsView()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
