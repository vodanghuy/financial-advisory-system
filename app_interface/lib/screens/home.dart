import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/authService.dart';
import 'login.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final AuthService _authService = AuthService();
  String? _fullName;
  String? _email;
  String? _phone;
  String? _gender;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  Future<void> _loadUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _fullName = prefs.getString('fullName');
      _email = prefs.getString('email');
      _phone = prefs.getString('phone');
      _gender = prefs.getString('gender');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Trang chủ'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await _authService.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Chào mừng, $_fullName!', style: TextStyle(fontSize: 20)),
            if (_email != null) Text('Email: $_email'),
            if (_phone != null) Text('SĐT: $_phone'),
            if (_gender != null) Text('Giới tính: $_gender'),
          ],
        ),
      ),
    );
  }
}
