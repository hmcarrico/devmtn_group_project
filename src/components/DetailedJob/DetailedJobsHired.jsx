import React, { Component } from 'react';
import './DetailedJobs.scss';
import axios from 'axios';
import {connect} from 'react-redux'
import Planning from '../../media/planning.svg';
import Started from '../../media/started.svg';
import Finished from '../../media/finished.svg';
import Paid from '../../media/paid.svg';

class DetailedJobsHired extends Component {
    constructor(){
        super();
        this.state = {
            job: [],
            showEmailForm: false,
            modalName: '',
            modalEmail: '',
            modalMessage: '',
            modalFile: '',
            modalClientEmail: '',
            status: '',
            accepted: null,
            client_id: null
        }
    }
    componentDidMount(){
        this.getJobInfo()
    }

    getJobInfo = () => {
        axios.get( `/api/getselectedjob/${this.props.jobID}`).then(res => {
            console.log('res.data.status', res.data[0].status)
            this.setState({job: res.data, status: res.data[0].status, accepted: res.data[0].accepted, client_id: res.data[0].client_id})
        })
    }

    changeStatus = (status, job_id) => {
        axios.post('/api/changestatus', {status, job_id}).then(res => {
            this.getJobInfo()
        })
    }


    showEmailModal = (email)=>{

        this.setState({
            showEmailForm: !this.state.showEmailForm,
            modalClientEmail: email
        })
    }

    handleChange = (key,val)=>{
        this.setState({
            [key]:val
        })
    }
    sendEmailToClient = (e)=>{
        e.preventDefault();
        let {modalName,modalEmail,modalMessage,modalFile,modalClientEmail} = this.state;
        axios.post(`/api/sendEmailToClient`,{modalName,modalEmail,modalMessage,modalFile,modalClientEmail}).then(res=>{
            console.log(res.data)
            if(res.data === 'sent'){
                this.setState({
                    showEmailForm: false
                })
                alert('message sent')
            } else alert('message failed')
        })
    }

    render() {
        let {userID} = this.props;
        const {showEmailForm} = this.state;
        // console.log('detailed job view', this.state.modalClientEmail);
        return (
            <div>
            { this.state.accepted === userID || this.state.client_id === userID ?

            <div className='detailedJobp'>
                {showEmailForm&&
                <div className='emailFormp'>
                    <form onSubmit={this.sendEmailToClient} className='emailFormc'>
                        <label>Name: </label>
                        <input onChange={e=>this.handleChange('modalName',e.target.value)} type="text" minLength='3' required/>
                        <label>Email: </label>
                        <input onChange={e=>this.handleChange('modalEmail',e.target.value)} type="email" required/>
                        <label>Message: </label>
                        <textarea onChange={e=>this.handleChange('modalMessage',e.target.value)} cols="30" rows="10" minLength='20' required />
                        <label style={{cursor:'pointer'}} htmlFor="files" className='attachDocs' >Attach Resumé</label>
                        <input onChange={e=>this.handleChange('modalFile',e.target.value)} id='files' style={{visibility:'hidden'}} type="file"/>
                        {this.props.userID&&<button type='submit'>Send</button>}
                    </form>
                        <button style={{cursor:'pointer'}} onClick={()=>this.showEmailModal('')}>Close</button>
                </div>
            }
                <div className="status-container">
                    { this.state.status === 'planning' ?
                    <img src={Planning} className="status"/>
                    : <></>
                    }
                    { this.state.status === 'started' ?
                    <img src={Started} className="status"/>
                    : <></>
                    }
                    { this.state.status === 'finished' ?
                    <img src={Finished} className="status"/>
                    : <></>
                    }
                    { this.state.status === 'paid' ?
                    <img src={Paid} className="status"/>
                    : <></>
                    }
                </div>
                <div className="job-container">
                {
                    this.state.job.map(job => {
                        return <div key={job.id} className="job-profile-view">
                        Posted By: <br />
                        <img src={job.profile_picture} alt=''/>
                        <h4>{job.profile_name}</h4>
                        <p onClick={()=>this.showEmailModal(job.email)} ><span style={{cursor:'pointer'}}>{job.email}</span></p>
                        </div>
                        
                    })
                }
                {
                    this.state.job.map(job => {
                        return <div key={job.id} className="detail-job-info">
                                    <h2>{job.title}</h2>
                                    <p className="detail-job-description">{job.description}</p>
                                    <p>Start Date: {job.start_date}</p>
                                    <p>${job.pay}</p>
                                    <p>Estimated Completion Time: {job.estimation}</p>
                                </div>
                            })
                }
                <div>
                    <input type="radio" name="status" value="planning" onChange={e => this.changeStatus(e.target.value, this.props.jobID)}/><label>Planning</label>
                    <input type="radio" name="status" value="started" onChange={e => this.changeStatus(e.target.value, this.props.jobID)}/><label>Started</label>
                    <input type="radio" name="status" value="finished" onChange={e => this.changeStatus(e.target.value, this.props.jobID)}/><label>Finished</label>
                    <input type="radio" name="status" value="paid" onChange={e => this.changeStatus(e.target.value, this.props.jobID)}/><label>Paid</label>
                </div>
                {console.log('this.state.status', this.state.status)}
                
                </div>
            </div>
            : 
            <div>
                <h1>This job no longer exists</h1>
            </div>
            }
            </div>
        )}
}

const mapStateToProps = (state) => {
    return {
        userID: state.userID
    }
}

export default connect(mapStateToProps)(DetailedJobsHired);
