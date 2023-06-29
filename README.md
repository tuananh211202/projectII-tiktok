# projectII-tiktok

Server:
> Run server: <br/>
>> npm run start <br/>
>> Server port: 3000 <br/>
>> API: <br/>
>>>> User <br/>
>>>>>> Public: <br/>
>>>>>>>> POST '/users/signup' (username, password, name, description) <br/>
>>>>>>>> POST '/auth/login' (username, password) <br/>
>>>>>> Need token: <br/>
>>>>>>>> GET '/auth/profile' <br/>
>>>> Noti( need token): <br/> 
>>>>>> POST '/users/:id/notis' (description) <br/>
>>>>>> GET '/users/:id:notis' <br/>
<br/>
