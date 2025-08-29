using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services.Interfaces;

namespace Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
  private readonly IOtpService _otpService;
  private readonly IUserService _userService;
  private readonly IJwtService _jwtService;

  public AuthController(IOtpService otpService, IUserService userService, IJwtService jwtService)
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

    var success = _userService.Register(req.Email, req.Password);
    if (!success) return Conflict(new { message = "User already exists" });

    var token = _jwtService.GenerateToken(req.Email);
    return Ok(new { message = "User registered successfully", token });
  }

  [HttpPost("login")]
  public IActionResult Login([FromBody] LoginRequest req)
  {
    var valid = _userService.ValidateCredentials(req.Email, req.Password);
    if (!valid) return BadRequest(new { message = "Invalid credentials" });

    var user = _userService.GetUser(req.Email)!;
    var token = _jwtService.GenerateToken(user.Email);
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
