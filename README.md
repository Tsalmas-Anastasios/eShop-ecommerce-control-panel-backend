
# Bizyhive app 


### e-Commerce Control Panel


BackEnd documentation


##### App to simulate an eShop control panel that includes everything about shops and their management.




## Notes (for after versions or the current)

- ### Add to terms and conditions of the app
    - 'Your DataBase credentials (including password, username and host) will be not encrypted to be used by our system'
    - 'Your email credentials (including password, username and host) will be not be encrypted to be used by our system'
    

- ### Structure for DBs integration
    - In the version 1.0, the user will can connect only one DataBase to the e-Commerce Control Panel, that will be register this with the 'registration' method or by the settings

- ### IDs Structure
    - **Account ID**: *acc_* chars(18)
    - **Account token ID**: *tkn_* chars(36)
    - **Order payment types**: *otp_* chars(36)
    - **Order products**: *orp_* chars(36)
    - **Orders**: *ord_* chars(36)
    - **Transfer couriers**: *trc_* chars(36)
    - **Transfer couriers types**: *tct_* chars(36)
    - **User roles**: chars(36)
    - **Users**: *usr_* chars(18)
    - **Products**: *prd_* chars(36)
    - **Products specification categories**: chars(36)
    - **Products specification fields**: chars(36)
    - **Order / sell invoice**: *inv_* chars(18)
    - **Tracking number for the orders**: *tracking_* chars(36)
    - **Order cost record ID**: *cls_* chars(36)
    - **Company data ID**: chars(36)
    - **Company email data ID**: *ned_* chars(36)
    - **Contact labels ID**: *cls_* chars(36)
    - **Contact labels names ID**: *cln_* chars(36)
    - **Contacts ID**: *cnt_* chars(36)
    - **Contact address data ID**: *cad_* chars(36)
    - **Contact custom field ID**: *ccf_* chars(36)
    - **Contact email data ID**: *ced_* chars(36)
    - **Contact phone data ID**: *cpd_* chars(36)
    - **Employee done payments ID**: *edp_* chars(36)
    - **Employee info ID**: *emp_* chars(36)
    - **Employee payments ID**: *epa_* chars(36)
    - **Employee worked hours ID**: *ewh_* chars(36)
    - **Login sessionsID**: chars(36)
    - **Newsletter clients email ID**: *nec_* chars(36)
    - **Newsletter history ID**: *nlm_* chars(36)
    - **Newsletter messages history clients email lists ID**: *nme_* chars(36)
    - **Product categories ID**: *pcg_* chars(36)
    - **Product images storage ID**: *pim_* chars(36)
    - **Products update history ID**: *hprod_* chars(36)
    - **Total sales monthly ID**: *tsm_* chars(36)
    - **Calculate order sum (general sum) ID**: *ordcalc_* chars(36)



- ### Memurandum
    - In the params column the english questionmark (?) used to notice that the specific param is optional
    - **Session object data (properties) - session.user**:
        - **user_id**: string
        - **email**: string
        - **username**: string
        - **first_name**: string
        - **last_name**: string
        - **phone**: string
        - **created_at**: string | Date
        - **role**: string
        - **is_account**: boolean
        - **connected_account**: string
        - **using_bizyhive_cloud**?: boolean





## Routes


### Auth routes
('/api/auth/...')
<table>
<thead>
<tr>
<th>Route</th>
<th>Route description</th>
<th>Method</th>
<th>Parsed parameters</th>
<th>Returned results</th>
</tr>
</thead>

<tbody>

<tr>
<td>/</td>
<td>Open route, unprotected</td>
<td>get</td>
<td>---</td>
<td>

```
{
    message: string
}
```

</td>
</tr>


<tr>
<td>/api/protected</td>
<td>Close route, protected. Basically used to check if the user is signed in on the BackEnd part of the app</td>
<td>get</td>
<td>---</td>
<td>

<table>
<tr>
<th>Status</th>
<th>Results</th>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    message: string,
    session_data: {
        user_id: string,
        email: string,
        username: string,
        first_name: string,
        last_name: string,
        phone: string,
        created_at; string | Date,
        role: string,
        is_account: boolean,
        connected_account?: string,
        using_bizyhive_cloud?: boolean,
        account_type: string
    }
}
```

</td>
</tr>
</table>

</td>
</tr>


<tr>
<td>/api/auth/login</td>
<td>Open route, unprotected. Used for  users to login in the Backend field of the app</td>
<td>post</td>
<td>

```
username: string (can be username or email both)
password: string

Query parameters:
{
    country_code: string,
    country_name: string,
    city: string,
    postal?: string,
    latitude: string,
    longitude: string,
    ipv4: string,
    ipv6?: string,
    state: string,
    uzing_bizyhive_cloud: boolean
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>

<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Login credentials are missing'
}
```

</td>
</tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'user_not_found_username_or_email_wrong',
    message: 'User not found, wrong username/email'
}
```

</td>
</tr>
<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'forbidden',
    message: 'Your email is not activated'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    user_id: string,
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    phone: string,
    created_at; string | Date,
    role: string,
    is_account: boolean,
    connected_account?: string,
    using_bizyhive_cloud?: boolean,
    account_type: string
}
```

</td>
</tr>
</table>

</td>
</tr>


<tr>
<td>/api/auth/register</td>
<td>Open route, unprotected. Used to register new users or accounts to the system</td>
<td>post</td>
<td>

```
{
    id?: string,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    confirm_password: string,
    phone: string,
    company_name?: string,
    connected_account_id?: string,
    is_account: boolean,
    role: string,
    using_bizyhive_cloud?: boolean
}
```

</td>
<td>
<table>
<tr>
<th>Status</th>
<th>Results</th>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Credentials to register the user are missing'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'The connected account credentials are missing'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Company name is missing',
}
```

</td>
\</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'username_exists',
    message: 'Username already exists',
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: email_exists',
    message: 'Email already exists',
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'phone_exists',
    message: 'Phone already exists',
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'invalid_data',
    message: 'Passwords don't match'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'password_out_of_range',
    message: 'Password length out of range'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'password_not_strength',
    message: 'Password doesn't meet the criteria'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'user_account_created_successfully',
    activation_key: string (api key),
    new_user_id: string,
    username: string,
    email: string,
    message: 'Account / User created successfully',
}
```

</td>
</tr>

</table>
</td>
</tr>

<tr>
<td>/api/auth/email-activation</td>
<td>Open route, unprotected. Used to activate accounts & users</td>
<td>get</td>
<td>

```
Link parameters
{
    key: string
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Activation key parameters are missing'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'The key isn't an activation token'
}
```

</td>
</tr>
<tr>
<td>419</td>
<td>

```
{
    code: 419,
    type: 'activation_key_expired',
    message: 'Activation key has expired',
    activation_key: string (new activation key)
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>208</td>
<td>

```
{
    code: 208,
    type: 'already_activated',
    message: 'This account (account email) has already been activated'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'successful_account_activation',
    message: 'User account activated successfully'
}
```

</td>
</tr>

</table>

</td>
</tr>
<tr>
<td>/api/auth/request-new-password</td>
<td>Open route, unprotected. Used to request a link to change the password</td>
<td>post</td>
<td>

```
{
    username: string (can be either username or email)
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Credentials to generate the token are missing'
}
```

</td>
</tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'user_not_found',
    message: 'User not found'
}
```

</td>

</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'generate_token_successful',
    user_id: string,
    username: string,
    email: string,
    account_type: string,
    token: string (api key),
    message: 'Token to change the password created successfully',
}
```

</td>
</tr>
</table>

</td>
</tr>
<tr>
<td>/api/auth/check-password-change-token</td>
<td>Open route, unprotected. Used to check if the token is valid to change the password</td>
<td>get</td>
<td>

```
Link parameters
{
    key: string
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Required parameters are missing'
}
```

</td>
</tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'user_not_found',
    message: 'User doesn't found'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Password change request didn't exist'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

<td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'successful_key_validation',
    valid: true,
    message: 'Successful key validation. You can change your password now',
    key: string,
    id: string,
    account_type: string
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/auth/change-password</td>
<td>Open route, unprotected. Used to change the password after request</td>
<td>post</td>
<td>

```
{
    id: string,
    password: string,
    confirm_password: string,
    account_type: string
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'bad_request',
    message: 'Required parameters are missing'
}
```

</td>
</tr>
<tr>
<td>406</td>
<td>

```
{
    code: 406,
    type: 'password_not_same',
    message: 'Password and Confirm password are not the same'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'password_out_of_range',
    message: 'Password length out of range',
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'password_not_strength',
    message: 'Password doesn't meet the criteria'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'password_changed',
    message: 'Password successfully changed'
}
```

</td>
</tr>
</table>

</td>
</tr>
<tr>
<td>/api/auth/logout</td>
<td>Close route, protected. Used to logout the legend in user</td>
<td>post</td>
<td>Current session</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    message: 'logout failed'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    status: '200 OK',
    message: 'Logout OK'
}
```

</td>
</tr>
</table>

</td>
</tr>
<tr>
<td>/api/auth/change-password-directly</td>
<td>ASK ANASTA</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_form_data',
    message: 'Missing form data (new password is missing)'
}
```

</td>
</tr>

<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'forbidden', 
    message: 'Wrong old password' 
}
```

</td>
</tr>

<tr>
<td>500</td>
<td>

```
{
    type: 'internal_server_error', 
    message: error.message
}
```
</tr>
</td>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'password_updated',
    message: 'Password updated successfully!'
}
```
</td>
</tr>


</table>



</tbody>
</table>

### Settings routes
('/api/settings/...')
<table>
<thead>
<tr>
<th>Route</th>
<th>Route description</th>
<th>Method</th>
<th>Parsed parameters</th>
<th>Returned results</th>
</tr>
</head>



<tbody>



</td>





<tr>
<td>/api/settings/account/security/2fa/email/activate </td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>
<tr>

<td>400</td>
<td>

```
{
    ode: 400, 
    type: 'connection_adopted', 
    message: 'No credentials found to proceed the execute'
}
```
</td>
</tr>

<tr>
<td>404</td>
<td>

```
{
    type: 'request_not_found', 
    message: 'No code to be authenticated found' 
}
```
</td>
</tr>

<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'authentication_2fa__email_activated',
    message: 'Email 2FA authentication service activated'
}
```
</td>
</tr>
</table>



<tr>
<td>/api/settings/account/security/2fa/email/de-activate</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>



<tr>
<td>400</td>
<td>

```
{
   code: 400, 
   type: 'connection_adopted', 
   message: 'No credentials found to proceed the execute' 
}
```
</td>
</tr>

<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'no_connection_found',
    message: 'The 2FA service via Email is not enabled'
}
```
</td>
</tr>

<tr>
<td>404</td>
<td>

```
{
    code: 404, 
    type: 'request_not_found', 
    message: 'No code to be authenticated found' 
}
```
<td>
</tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message 
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'authentication_2fa__email_activated',
    message: 'Email 2FA authentication service activated'
}
```
<td>
</tr>



</table>

<tr>
<td>/api/settings/accouns/security/2fa/app/enable</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'forbidden',
    message: 'Missing credentials'
}
```

</td>
</tr>

<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'token_validation_failed',
    message: 'The token cannot be verified'
}
```
</td>
</tr>


<tr>
<td>500</td>
<td>

```
{
     code: 500, 
     type: 'internal_server_error', 
     message: error?.message
}
```

</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'connection_succeeded',
    message: 'Connection with authenticator app created successfully'
}
```


</td>
</tr>

</table>



<tr>
<td>/api/settings/account/security/2fa/app/disable</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'token_not_found',
    message: 'Token to validate not found'
}
```

</td>
</tr>

<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'token_invalid',
    message: '6-digit code is not valid',
}
```
</tr>
</td>



<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'no_connection_found',
    message: 'The 2FA service via Authenticator app is not enabled'
}
```
</td>
</tr>


<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'no_secret_key_found',
    message: 'Secret key to validate this action cannot be found'
}
```
</td>
</tr>


<tr>
<td>500</td>
<td>

```
{
   code: 500, t
   ype: 'internal_server_error', 
   message: error?.message  
}
```


</td>
</tr>


<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'service_disabled',
    message: '2FA via Authenticator App service disabled successfully'
}
```

</table>



<tr>
<td>/api/settings/company-data/get</td>
<td>ASK</td>
<td>get</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>

</table>






<tr>
<td>/api/settings/company-data/save-logo</td>
<td>ASK</td>
<td>post</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>


<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'logo_saved',
    message: 'Company\'s logo saved successfully',
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    destination: req.file.destination,
    filename: req.file.filename,
    file_url: `${process.env.COMPANY_LOGO_STORAGE_FOLDER}/${req.file.filename}`
}
```
</td>
</tr>

</table>

<tr>
<td>/api/settings/company-data/add-new-rec</td>
<td>ASK</td>
<td>post</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_data',
    message: 'Missing data to be added'
}
```
</td>
</tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'company_data_saved',
    message: 'Company data saved successfully!',
    rec_id: new_record_id,
}
```
</td>
</tr>

</table>



<tr>
<td>/api/settings/company-data/update/:rec_id</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>


<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_data',
    message: 'Missing data and cannot be updated'
}
```
</td>
</tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error',
    message: error?.message
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'company_data_updated',
    message: 'Company\'s data updated'
}
```

</table>


<tr>
<td>/api/settings/company-data/update/:rec_id</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>



<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error',
    message: error?.message
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    exists: exists 
}
```

</table>



</table>



</td>
</tr>








</tbody>
</table>

</table>






### Authentication routes
('/api/authentication/...')
<table>
<thead>
<tr>
<th>Route</th>
<th>Route description</th>
<th>Method</th>
<th>Parsed parameters</th>
<th>Returned results</th>
</tr>
</thead>

<tbody>


<tr>
<td>/api/authentication/account/security/2fa/email/authentication-code/send-email</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message 
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'waiting_for_authentication',
    message: 'Waiting for authentication',
    emailId: emailId
}
```
</td>
</tr>




</table>

<tr>
<td>/api/authentication/account/security/2fa/email/authentication-code/send-email</td>
<td> ASK</td>
<td> put</td>
<td> ASK </td>
<td> 
<table>
<tr> <th>Status</th><th>Results</th></tr>
<tr>

<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message 
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'waiting_for_authentication',
    message: 'Waiting for authentication',
    emailId: emailId 
}
```
</tr>
</td>


</table>
</td>
</tr>


<tr>
<td>/api/authentication/account/security/2fa/email/authentication-code/check</td>
<td>ASK</td>
<td>put</td>
<td>Ask</td>
<td>
<table>
<tr> <th>Status</th><Th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400, 
    type: 'connection_adopted', 
    message: 'No credentials found to proceed the execute'
}

```
</td>
</tr>

<tr>
<td>400</td>
<td>

```
{
     code: 400, 
     type: 'no_session_found', 
     message: 'Session data doesn\'t found' 
}
```
</td>
</tr>

<tr>
<td>404</td>
<td>

```
{
    code: 404, 
    type: 'request_not_found', 
    message: 'No code to be authenticated found'
}
```
</td>
</tr>



<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>


<tr>
<td>200</td>
<td>

```
{
    user: req.session.user,
    is_valid: true 
}
```
</td>
</tr>

</table>

<tr>
<td>/api/authentication/account/security/2fa/app/authentication-code/key</td>
<td>ASK</td>
<td>get</td>
<td>Ask</td>
<td>
<table>
<tr> <th>Status</th><Th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
     code: 500, 
     type: 'internal_server_error', 
     message: error?.message
}

```


</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    otpauth_url: user_secret.otpauth_url,
    code: user_secret.base32
}
```
</td>
</tr>

</table>


<tr>
<td>/api/authentication/account/security/2fa/app/authentication-code/verify</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>



<tr>
<td>400</td>
<td>

```
{
     
    code: 400, 
    type: 'no_session_found', 
    message: 'Session data doesn\'t found'
}
```

</td>
</tr>

<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'forbidden',
    message: 'Missing credentials',
}
```
</td>
</tr>



<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'no_token_found',
    message: 'No token submitted with form'
}
```
</td>
</tr>

<tr>
<td>403</td>
<td>

```
{
    code: 403,
    type: 'token_not_match',
    message: 'Tokens aren\'t match'
}
```
</td>
</tr>

<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
 user: req.session.user, 
 is_valid: true   
}
```
</td>
</tr>



</table>

</table>











</tr>
</table>
</table>



### Orders routes
('/api/ecommerce/store/orders/...')
<table>
<thead>
<tr>
<th>Route</th>
<th>Route description</th>
<th>Method</th>
<th>Parsed parameters</th>
<th>Returned results</th>
</tr>
</thead>

<tbody>

<tr>
<td>/api/ecommerce/store/orders</td>
<td>Close route, protected.Refers to the shop orders and displays the general list of the orders</td>
<td>get</td>
<td>data from session.user object (connected_account_id)</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string,
    errors?: string[]
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

Giving back an array of:
```
{
    order_id: string,
    proof: 'receipt' | 'invoice',
    first_name; string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    phone: string,
    cell_phone?: string,
    confirm_date?: string | Date,
    sent_date?: string | Date,
    completed_date?: string | Date,
    returned_date?: string | Date,
    archived_date?: string | Date,
    confirmed?: boolean,
    sent?: boolean,
    completed?: boolean,
    transfer_courier: string,
    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned',
    invoice_data__company?: string,
    invoice_data__tax_number?: string,
    invoice_data__doy?: string,
    invoice_data__address?: string,
    invoice_data__country?: string,
    invoice_data__phone?: string,
    invoice_data__cell_phone?: string,
    invoice_data__is_valid?: string,
    payment_type?: string,
    connected_account_id?: string,
    order_number?: string,
    invoice_data__invoice_number?: string,
    archived?: boolean,
    clear_value: number,
    transportation: number,
    cash_on_delivery_payment: boolean,
    cash_on_delivery: number,
    extra_fees: boolean,
    extra_fees_costs: number,
    fees: boolean,
    fee_percent: number,
    tracking_number: string,
    tracking_url: string,
    order_products: [
        {
            product_identifiers: {
                rec_id?: string,
                product_id: string,
                order_id: string,
                connected_account_id: string,
                active: boolean,
                archived: boolean,
                quantity: boolean,
                supplied_customer_price: number,
                discount: number,
                discount_percent: number,
                fees: number,
                fee_percent: number
            },
            product_details: {
                product_id: string,
                headline: string,
                product_brand: string,
                categories_belongs: string,
                product_code: string,
                product_model: string,
                images: string,
                notes: string
            }
        },
        ...
    ]
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/specific-orders</td>
<td>Close route, protected. Refers to the shop orders and displays a specific list of them</td>
<td>get</td>
<td>

```
data from session.user object (connected_account_id)
```

Parameters should be passed as query parameters in the link (?...)
```
{
    address?: string,
    postal_code?: string,
    city?: string,
    country?: string,
    transfer_courier?: string,
    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned'
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string,
    errors?: string[]
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

Giving back an array of:
```
{
    order_id: string,
    proof: 'receipt' | 'invoice',
    first_name; string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    phone: string,
    cell_phone?: string,
    confirm_date?: string | Date,
    sent_date?: string | Date,
    completed_date?: string | Date,
    returned_date?: string | Date,
    archived_date?: string | Date,
    confirmed?: boolean,
    sent?: boolean,
    completed?: boolean,
    transfer_courier: string,
    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned',
    invoice_data__company?: string,
    invoice_data__tax_number?: string,
    invoice_data__doy?: string,
    invoice_data__address?: string,
    invoice_data__country?: string,
    invoice_data__phone?: string,
    invoice_data__cell_phone?: string,
    invoice_data__is_valid?: string,
    payment_type?: string,
    connected_account_id?: string,
    order_number?: string,
    invoice_data__invoice_number?: string,
    archived?: boolean,
    clear_value: number,
    transportation: number,
    cash_on_delivery_payment: boolean,
    cash_on_delivery: number,
    extra_fees: boolean,
    extra_fees_costs: number,
    fees: boolean,
    fee_percent: number,
    tracking_number: string,
    tracking_url: string,
    order_products: [
        {
            product_identifiers: {
                rec_id?: string,
                product_id: string,
                order_id: string,
                connected_account_id: string,
                active: boolean,
                archived: boolean,
                quantity: boolean,
                supplied_customer_price: number,
                discount: number,
                discount_percent: number,
                fees: number,
                fee_percent: number
            },
            product_details: {
                product_id: string,
                headline: string,
                product_brand: string,
                categories_belongs: string,
                product_code: string,
                product_model: string,
                images: string,
                notes: string
            }
        },
        ...
    ]
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id</td>
<td>Close route, protected. Displays a specific order</td>
<td>get</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string,
    errors?: string[]
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    order_id: string,
    proof: 'receipt' | 'invoice',
    first_name; string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    phone: string,
    cell_phone?: string,
    confirm_date?: string | Date,
    sent_date?: string | Date,
    completed_date?: string | Date,
    returned_date?: string | Date,
    archived_date?: string | Date,
    confirmed?: boolean,
    sent?: boolean,
    completed?: boolean,
    transfer_courier: string,
    current_status?: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned',
    invoice_data__company?: string,
    invoice_data__tax_number?: string,
    invoice_data__doy?: string,
    invoice_data__address?: string,
    invoice_data__country?: string,
    invoice_data__phone?: string,
    invoice_data__cell_phone?: string,
    invoice_data__is_valid?: string,
    payment_type?: string,
    connected_account_id?: string,
    order_number?: string,
    invoice_data__invoice_number?: string,
    archived?: boolean,
    clear_value: number,
    transportation: number,
    cash_on_delivery_payment: boolean,
    cash_on_delivery: number,
    extra_fees: boolean,
    extra_fees_costs: number,
    fees: boolean,
    fee_percent: number,
    tracking_number: string,
    tracking_url: string,
    order_products: [
        {
            product_identifiers: {
                rec_id?: string,
                product_id: string,
                order_id: string,
                connected_account_id: string,
                active: boolean,
                archived: boolean,
                quantity: boolean,
                supplied_customer_price: number,
                discount: number,
                discount_percent: number,
                fees: number,
                fee_percent: number
            },
            product_details: {
                product_id: string,
                headline: string,
                product_brand: string,
                categories_belongs: string,
                product_code: string,
                product_model: string,
                images: string,
                notes: string
            }
        },
        ...
    ]
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id</td>
<td>Close route, protected. Use this route to edit an existing order. This route cannot update the order status</td>
<td>put</td>
<td>

```
{
    order_id?: string,
    proof?: 'receipt' | 'invoice',
    first_name?: string,
    last_name?: string,
    address?: string,
    postal_code?: string,
    city?: string,
    country?: string,
    phone?: string,
    cell_phone?: string,
    transfer_courier?: string,
    invoice_data__company?: string,
    invoice_data__tax_number?: string,
    invoice_data__doy?: string,
    invoice_data__address?: string,
    invoice_data__postal_code?: string,
    invoice_data__city?: string,
    invoice_data__country?: string,
    invoice_data__phone?: string,
    invoice_data__cell_phone?: string,
    invoice_data__is_value?: string,
    payment_type?: string,
    invoice_data__invoice_number?: string,
    clear_value?: number,
    transportation?: number,
    cash_on_delivery_payment?: boolean,
    cash_on_delivery?: number,
    extra_fees?: boolean,
    extra_fees_costs?: number,
    fees?: boolean,
    fee_percent?: number,
    total?: number,
    tracking_number?: string,
    tracking_url?: string,
    order_products: [
        {
            product_identifiers: {
                rec_id?: string,
                product_id: string,
                order_id: string,
                connected_account_id: string,
                active: boolean,
                archived: boolean,
                quantity: boolean,
                supplied_customer_price: number,
                discount: number,
                discount_percent: number,
                fees: number,
                fee_percent: number
            },
            product_details: {
                product_id: string,
                headline: string,
                product_brand: string,
                categories_belongs: string,
                product_code: string,
                product_model: string,
                images: string,
                notes: string
            }
        },
        ...
    ]
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_credentials_to_update_the_order',
    message: 'MIssing credentials and the order cannot be updated',
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_order_products_info',
    message: 'MIssing products info and cannot be recognized',
}
```

</td>
</tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 400,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_updated',
    message: 'Your order has been successfully updated!'
}
```

</td>
</tr>
</table>

</td>
</tr>
<tr>
<td>/api/ecommerce/store/orders/new</td>
<td>Close route, protected. We use it to insert a new order from control panel</td>
<td>post</td>
<td>

```
{
    proof: 'receipt' | 'invoice',
    first_name: string,
    last_name: string,
    address: string,
    postal_code: string,
    city: string,
    country: string,
    phone: string
    cell_phone?: string,
    transfer_courier: string,
    current_status: 'confirmed',
    invoice_data__company?: string,
    invoice_data__tax_number?: string,
    invoice_data__doy?: string,
    invoice_data__address?: string,
    invoice_data__postal_code?: string,
    invoice_data__city?: string,
    invoice_data__country?: string,
    invoice_data__phone?: string,
    invoice_data__cell_phone?: string,
    invoice_data__is_value?: string,
    payment_type: string,
    invoice_data__invoice_number?: string,
    clear_value: number,
    transportation: number,
    cash_on_delivery_payment: boolean,
    cash_on_delivery?: number.
    extra_fees: boolean,
    extra_fees_costs?: number.
    fees: boolean,
    fee_percent?: number,
    total: number,
    tracking_number?: string,
    tracking_url?: string,
    order_products: [
        {
            product_identifiers: {
                rec_id?: string,
                product_id: string,
                order_id: string,
                connected_account_id: string,
                active: boolean,
                archived: boolean,
                quantity: boolean,
                supplied_customer_price: number,
                discount: number,
                discount_percent: number,
                fees: number,
                fee_percent: number
            },
            product_details: {
                product_id: string,
                headline: string,
                product_brand: string,
                categories_belongs: string,
                product_code: string,
                product_model: string,
                images: string,
                notes: string
            }
        },
        ...
    ]
}
```

</td>
<td>

<table>
<tr><th>Status</th><th>Results</th></tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_credentials_to_update_the_order',
    message: 'Missing credentials and the order cannot be updated'
}
```

</td>
</tr>
<tr>
<td>400</td>
<td>

```
{
    code: 400,
    type: 'missing_order_products_info',
    message: 'Missing products info and cannot be recognized'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_saved',
    message: 'Your order has been successfully saved!'
}
```

</td>
</tr>
</table>

</td>
</tr>
<tr>
<td>/api/ecommerce/store/orders/:order_id/sent</td>
<td>Close route, protected. Use it to change the order status to 'sent'</td>
<td>put</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Result</th></tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in',
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_updated_to_sent',
    message: 'Order has been successfully updated with status 'sent'',
    updated_datetime: new Date(),
    current_status: 'sent'
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id/completed</td>
<td>Close route, protected. Use it to change the order status to 'completed'</td>
<td>put</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Result</th></tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_updated_to_completed',
    message: 'Order has been successfully updated with status 'completed'',
    updated_datetime: new Date(),
    current_status: 'completed'
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id/archived</td>
<td>Close route, protected. Use it to change the order status to 'archived' (typically status changed to archived and the order been closed)</td>
<td>put</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Result</th></tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_canceled',
    message: 'Order canceled successfully. This action cannot been undo',
    updated_datetime: new Date(),
    current_status: 'archived'
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id/returned</td>
<td>Close route, protected. Use it to change the order's status to 'returned'</td>
<td>put</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Result</th></tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_returned',
    message: 'Order returned successfully. This action cannot been undo',
    updated_datetime: new Date(),
    current_status: 'archived'
}
```

</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>/api/ecommerce/store/orders/:order_id/confirmed</td>
<td>Close route, protected. Use it to change the order status to 'confirmed'</td>
<td>put</td>
<td>

```
data from session.user object (connected_account_id)

link parameters:
 - :order_id
```

</td>
<td>

<table>
<tr><th>Status</th><th>Result</th></tr>
<tr>
<td>404</td>
<td>

```
{
    code: 404,
    type: 'order_not_found',
    message: 'Order doesn't found for this account'
}
```

</td>
</tr>
<tr>
<td>401</td>
<td>

```
{
    code: 401,
    type: 'unauthorized',
    message: 'Please sign in'
}
```

</td>
</tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500,
    type: 'internal_server_error',
    message: string
}
```

</td>
</tr>
<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'order_updated_to_confirmed',
    message: 'Order has been successfully updated with status 'confirmed'',
    updated_datetime: new Date(),
    current_status: 'confirmed'
}
```

</td>
</tr>
</table>

</td>
</tr>

</tbody>
</table>

### Acount Routes
('/api/account/...')
<table>
<thead>
<tr>
<th>Route</th>
<th>Route description</th>
<th>Method</th>
<th>Parsed parameters</th>
<th>Returned results</th>
</tr>
</thead>





<tbody>
<tr>
<td>/api/account/settings/api/token/n/new</td>
<td>ASK</td>
<td>post</td>
<td>ASK</td>
<td>
<table>
<tr> <th>Status</th><th>Results</th></tr>
<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message 
}
```
</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200,
    type: 'token_generated',
    message: 'Token generated successfully',
    token_value: token_identifiers.token_value,
    permissions: `$token_permissions.products_open ? `products_open,`
}
```
</td>
</tr>


</table>


<tr>
<td>/api/account/settings/api/token/:token_id</td>
<td>ASK</td>
<td>put</td>
<td>ASK</td>
<td>
<table>
<tr><th>Status</th><th>Results</th></tr>



<tr>
<td>404</td>
<td>

```
{
    code: 404, 
    type: 'token_not_found', 
    message: 'Token doesn\'t exist'
}
```
</td>
</tr>

<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message 
}
```
</td>
</tr>


<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```

</td>
</tr>

<tr>
<td>200</td>
<td>

```
{
    code: 200, 
    type: 'token_deleted', 
    message: 'Token deleted successfully' 
}
```
</td>
</tr>

</table>



<tr>
<td>/api/account/settings/api/token/l/list</td>
<td>ASK</td>
<td>get</td>
<td>ASK</td>
<td>
<table>
<tr><th>Status</th><th>Results</th></tr>



<tr>
<td>500</td>
<td>

```
{
    code: 500, 
    type: 'internal_server_error', 
    message: error?.message
}
```
</td>
</tr>

</table>



</td>
</td>



</td>
</tr>
</tbody>
</table>
</table>