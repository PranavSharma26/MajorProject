import 'dart:ui';
import 'package:flutter/material.dart';

class MyRegister extends StatefulWidget {
  const MyRegister({Key? key}) : super(key: key);

  @override
  _MyRegisterState createState() => _MyRegisterState();
}

class _MyRegisterState extends State<MyRegister> {
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/registerImage.avif'),
          fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(25),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  width: screenWidth > 600 ? 500 : double.infinity,
                  padding: const EdgeInsets.all(25),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(color: Colors.white.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Create\nAccount',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontFamily: 'Poppins',
                        ),
                      ),
                      const SizedBox(height: 30),
                      TextField(
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Name',
                          hintStyle: TextStyle(color: Colors.white70),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.2),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Email',
                          hintStyle: TextStyle(color: Colors.white70),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.2),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        obscureText: true,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Password',
                          hintStyle: TextStyle(color: Colors.white70),
                          filled: true,
                          fillColor: Colors.white.withOpacity(0.2),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Sign Up',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              fontFamily: 'Poppins',
                            ),
                          ),
                          CircleAvatar(
                            radius: 28,
                            backgroundColor: Colors.white,
                            child: IconButton(
                              icon: const Icon(Icons.arrow_forward),
                              onPressed: () {},
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 30),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, 'login');
                          },
                          child: const Text(
                            'Sign In',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
