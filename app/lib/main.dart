import 'package:app/login.dart';
import 'package:app/register.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: 'login',  // this is what i want as a first page 
    routes: {
    'login':(context)=> MyLogin(),
    'register':(context)=>MyRegister(), // this is the route for the login page 
  }));
}
