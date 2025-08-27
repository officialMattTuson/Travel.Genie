using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Models;
using Travel.Genie.Services;

namespace Travel.Genie.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
  private readonly OtpService _otpService;
  private readonly UserService _userService;
  private readonly JwtService _jwtService;

  public AuthController(OtpService otpService, UserService userService, JwtService jwtService)
  {
    _otpService = otpService;
    _userService = userService;
    _jwtService = jwtService;
  }

  [HttpPost("request-otp")]
  public async Task<IActionResult> RequestOtp([FromBody] OtpRequest req)
  {
    await _otpService.GenerateOtpAsync(req.Email);
    return Ok(new { message = "OTP sent to your email inbox ✅" });
  }


  [HttpPost("verify-otp")]
  public IActionResult VerifyOtp([FromBody] VerifyOtpRequest req)
  {
    var valid = _otpService.VerifyOtp(req.Email, req.Otp);
    if (!valid) return BadRequest(new { message = "Invalid or expired OTP" });

    _userService.MarkEmailVerified(req.Email);
    return Ok(new { message = "OTP verified. You can now register." });
  }

  [HttpPost("register")]
  public IActionResult Register([FromBody] RegisterRequest req)
  {
    if (!_userService.IsEmailVerified(req.Email))
      return BadRequest(new { message = "Email not verified" });

    var success = _userService.Register(req.Email, req.Username, req.Password);
    if (!success) return Conflict(new { message = "User already exists" });

    var token = _jwtService.GenerateToken(req.Email, req.Username);
    return Ok(new { message = "User registered successfully", token });
  }

  [HttpPost("login")]
  public IActionResult Login([FromBody] LoginRequest req)
  {
    var valid = _userService.ValidateCredentials(req.Email, req.Password);
    if (!valid) return BadRequest(new { message = "Invalid credentials" });

    var user = _userService.GetUser(req.Email)!;
    var token = _jwtService.GenerateToken(user.Email, user.Username);
    return Ok(new { token });
  }

  [HttpGet("protected")]
  [Microsoft.AspNetCore.Authorization.Authorize]
  public IActionResult Protected()
  {
    return Ok(new
    {
      message = "You accessed a protected route!",
      user = User.Identity?.Name,
      claims = User.Claims.Select(c => new { c.Type, c.Value })
    });
  }
}
