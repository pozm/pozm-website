import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import userContext from '../hooks/userContext';
import '../styles/InfoBox.css';
import '../styles/utils.css';
type Props= {

};


export const AccountPage: React.FC<Props> = () => {
    let uv = useContext(userContext)
    return (
        <div className="InfoBox">
            test
        </div>
	);
}
export default AccountPage;
