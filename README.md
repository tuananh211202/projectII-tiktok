# projectII-tiktok

Server:
> Run server: <br/>
>> npm run start <br/>
>> Server port: 3000 <br/>
>> API: <br/>
>>>> User <br/>
>>>>>> Public: <br/>
>>>>>>>> Signup: POST '/users/signup' (username, password, name, description) <br/>
>>>>>>>> Login: POST '/auth/login' (username, password) <br/>
>>>>>> Need token: <br/>
>>>>>>>> Get profile: GET '/auth/profile' <br/>
>>>> Noti( need token): <br/> 
>>>>>> Create noti: POST '/users/:id/notis' (description) <br/>
>>>>>> Get all noti: GET '/users/:id:notis' <br/>
>>>> Follow( need token): <br/>
>>>>>> UserId follow Id: POST '/users/:userId/follow/:id' <br/>
>>>>>> UserId unfollow Id: DELETE '/users/:userId/follow/:id' <br/>
>>>>>> Get all followers: GET '/users/:userId/followers' <br/>
>>>>>> Get all following: GET '/users/:userId/following' <br/>
<br/>
