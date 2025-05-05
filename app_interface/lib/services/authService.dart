import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'package:flutter/material.dart';

class AuthService {
  static const String baseUrl = 'http://localhost:3000/auth';

  Future<User?> login(
    String email,
    String password,
    BuildContext context,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      final user = User.fromJson(json);
      await _saveUser(user);
      // Kiểm tra giá trị role và chuyển hướng
      if (user.role == 'User') {
        Navigator.pushReplacementNamed(context, '/home'); // Trang người dùng
      } else if (user.role == 'Admin') {
        Navigator.pushReplacementNamed(context, '/admin'); // Trang quản lý
      }
      return user;
    } else {
      throw Exception('Đăng nhập thất bại');
    }
  }

  Future<String> register(
    String password,
    String fullName,
    String tel,
    String email,
    String gender,
    String DOB,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "email": email,
        "password": password,
        "fullName": fullName,
        "tel": tel,
        "gender": gender,
        "dateOfBirth": DOB,
        "role": "User",
      }),
    );

    if (response.statusCode == 200) {
      return "Đăng ký thành công";
    } else {
      final responseData = jsonDecode(response.body);
      return "Đăng ký thất bại : ${responseData['message']}";
    }
  }

  Future<bool> checkUserName(String username) async {
    final response = await http.post(
      Uri.parse('$baseUrl/checkusername?username=$username'),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.body.compareTo("true") == 0) {
      return true;
    }
    return false;
  }

  Future<String> checkUser(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/checkuser?username=$username&password=$password'),
      headers: {'Content-Type': 'application/json'},
    );
    return response.body.toString();
  }

  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', user.token);
    await prefs.setString('email', user.email);
    await prefs.setString('role', user.role);
    await prefs.setString('tel', user.tel);
    await prefs.setString('dateOfBirth', user.dateOfBirth);
    await prefs.setString('gender', user.gender);
    await prefs.setString('fullName', user.fullName);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('token');
  }
}
