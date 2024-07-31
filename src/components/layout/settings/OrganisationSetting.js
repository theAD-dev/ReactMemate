import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import { Button, Table } from 'react-bootstrap';
import { Check,PlusLg } from "react-bootstrap-icons";
import { ProjectStatusesList} from "../../../APIs/SettingsGeneral";

const OrganisationSetting = () => {
    const [activeTab, setActiveTab] = useState('organisation-setting');
    const [options, setOptions] = useState([{ id: 1, color: 'red' }]);
    const [savedOptions, setSavedOptions] = useState(options); 
    const [colorStatus, setColorStatus] = useState(); 
    const [statusData, setStatusData] = useState();
    console.log('statusData: ', statusData);
    const [selectedColor, setSelectedColor] = useState('');
    const [showColorBox, setShowColorBox] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await ProjectStatusesList();
    
            setStatusData(data);
          } catch (error) {
            console.error("Error fetching Bank information:", error);
          }
        };
    
        fetchData();
      }, []);




      const handleRadioChange = (event) => {
        setSelectedColor(event.target.value);
        setShowColorBox(true);
      };



    const addOption = () => {
        setOptions([...options, { id: options.length + 1, color: 'red' }]);
    };

    const removeOption = (id) => {
        setOptions(options.filter(option => option.id !== id));
        setSavedOptions(savedOptions.filter(option => option.id !== id)); 
    };

    const updateOptionColor = (id, color) => {
        setOptions(options.map(option => option.id === id ? { ...option, color } : option));
    };

    const saveOption = (id) => {
        const optionToSave = options.find(option => option.id === id);
        setSavedOptions([...savedOptions.filter(option => option.id !== id), optionToSave]);
    };

    return (
        <div className='settings-wrap'>
            <div className="settings-wrapper">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="settings-content setModalelBoots">
                    <div className='headSticky'>
                        <h1>Organisation Setting</h1>
                    </div>
                    <div className="content_wrap_main">
                        <div className='content_wrapper'>
                            <div className="listwrapper orgColorStatus">
                                <h4>Custom Order Status</h4>
                                <Table>
                                    <tbody>
                                        {options.map(option => (
                                            <tr key={option.id}>
                                                <td>Status</td>
                                                <td>
                                                    <div className='statusTitle'><input type="text" onChange={(e) =>
                                                       setColorStatus({ bank_name: e.target.value,})}/></div>
                                                    <div className="orgStatusColorWrap">
                                                   
                                                    <label class="containerStatus">
                                                    <input type="radio" value="red" checked={selectedColor === 'red'} name="radio"  onChange={handleRadioChange} />
                                                    <span class="checkmark"></span>
                                                    </label>
                                                    <label class="containerStatus">
                                                    <input type="radio" value="green" checked={selectedColor === 'green'} name="radio"  onChange={handleRadioChange} />
                                                    <span class="checkmark"></span>
                                                    </label>
                                                 
                                                    <label class="containerStatus">
                                                    <input type="radio" value="blue" checked={selectedColor === 'blue'} name="radio"  onChange={handleRadioChange} />
                                                    <span class="checkmark"></span>
                                                    </label>
                                                 
                                                  

                                                    {showColorBox && (
                                                        <div style={{ marginTop: '20px', height: '100px', width: '100px', backgroundColor: selectedColor }}>
                                                        This is a {selectedColor} color box!
                                                        </div>
                                                    )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Button onClick={() => saveOption(option.id)}>Save</Button>
                                                    <Button onClick={() => removeOption(option.id)}>Remove</Button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td id='addmoreOption' colSpan={3}><Button onClick={addOption}>Add an Option <PlusLg size={20} color='#000000'/></Button></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrganisationSetting;
