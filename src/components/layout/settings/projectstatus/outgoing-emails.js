import React, { useState } from "react";
import '@szhsin/react-menu/dist/index.css';
import Sidebar from '../Sidebar';
import { Button, Table } from 'react-bootstrap';
import { PlusLg } from "react-bootstrap-icons";
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import style from './project.module.scss';

// Define schema for multiple entries
const schema = yup.object().shape({
  emails: yup.array().of(
    yup.object().shape({
      email: yup.string().email('Invalid email address').required('Email is required'),
      username: yup.string().required('Username is required')
    })
  )
});

const OutgoingEmails = () => {
  const [activeTab, setActiveTab] = useState('project-status');
  const [rows, setRows] = useState([{ id: 1 }]); // State to store rows

  const { control, handleSubmit, formState: { errors }, register } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emails: [{ email: '', username: '' }] // Default values for array fields
    }
  });

  const onSubmit = (data) => {
    console.log(data); // Outputs all the rows
  };

  // Function to handle adding a new row
  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  // Function to handle removing a row
  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <div className='settings-wrap'>
      <div className="settings-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="settings-content setModalelBoots">
          <div className='headSticky'>
            <h1>Organisation Setting</h1>
            <div className='contentMenuTab'>
              <ul>
                <li><Link to="/settings/projectstatus/project-status">Project Status</Link></li>
                {/* <li className='menuActive'><Link to="/settings/projectstatus/outgoing-emails">Outgoing Emails</Link></li> */}
              </ul>
            </div>
          </div>
          <div className="content_wrap_main">
            <div className='content_wrapper'>
              <div className="listwrapper orgColorStatus">
                <h4>Outgoing Emails</h4>
                <p>The status name can be up to 20 characters long.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Table id={style.outgoingTable}>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.id}>
                          <td>
                            <div className={style.formWrapEmail}>
                              <div className={style.boxGroupList}>
                                <label htmlFor={`emails.${index}.email`}>Outgoing email</label>
                                <Controller
                                  name={`emails.${index}.email`}
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      id={`emails.${index}.email`}
                                      placeholder="john@email.com"
                                      type="email"
                                    />
                                  )}
                                />
                                {errors.emails?.[index]?.email && (
                                  <p>{errors.emails[index].email.message}</p>
                                )}
                              </div>
                              <div className={style.boxGroupList}>
                                <label htmlFor={`emails.${index}.username`}>Name</label>
                                <Controller
                                  name={`emails.${index}.username`}
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      id={`emails.${index}.username`}
                                      placeholder="john"
                                    />
                                  )}
                                />
                                {errors.emails?.[index]?.username && (
                                  <p>{errors.emails[index].username.message}</p>
                                )}
                              </div>
                              <div className={style.boxGroupList}>
                                <Button>Connected</Button>
                              </div>
                            </div>
                          </td>
                          <td className="butactionOrg">
                            <Button className="save" type="submit">Save</Button>
                            <Button className="remove" onClick={() => removeRow(row.id)}>Remove</Button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td id='addmoreOption' colSpan={3}>
                          <Button onClick={addRow}>
                            Add &nbsp;<PlusLg size={20} color='#000000' />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutgoingEmails;
