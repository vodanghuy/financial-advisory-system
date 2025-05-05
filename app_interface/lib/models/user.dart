class User {
  final String email;
  final String tel;
  final String fullName;
  final String dateOfBirth;
  final String gender;
  final String role;
  final String token;

  User({
    required this.email,
    required this.role,
    required this.token,
    required this.fullName,
    required this.dateOfBirth,
    required this.gender,
    required this.tel,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      email: json['email'],
      role: json['role'],
      token: json['token'],
      tel: json['tel'],
      fullName: json['fullName'],
      dateOfBirth: json['dateOfBirth'],
      gender: json['gender'],
    );
  }
}
