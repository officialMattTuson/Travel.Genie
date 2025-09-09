using Microsoft.AspNetCore.Mvc;
using Travel.Genie.Models.Authentication;
using Travel.Genie.Services.Interfaces;
using Travel.Genie.Services;
using Microsoft.AspNetCore.Authorization;

namespace Travel.Genie.Controllers;

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
    return Ok();
  }


  [HttpPost("verify-otp")]
  [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
  public IActionResult VerifyOtp([FromBody] VerifyOtpRequest req)
  {
    var result = _otpService.VerifyOtp(req.Email, req.Otp);
    switch (result)
    {
      case OtpVerificationResult.Success:
        _userService.MarkEmailVerified(req.Email);
        return Ok(new { message = "One Time Password verified. You can now register." });
      case OtpVerificationResult.Expired:
        return StatusCode(410, new { message = "This One Time Password has expired. Please request a new one." });
      case OtpVerificationResult.Incorrect:
        return StatusCode(422, new { message = "The One Time Password you entered is incorrect. Please try again or request a new code." });
      case OtpVerificationResult.NotFound:
        return NotFound(new { message = "No One Time Password found for this email. Please request one." });
      default:
        return BadRequest(new { message = "Invalid One Time Password request." });
    }
  }

  [HttpPost("register")]
  [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
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
  [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
  public IActionResult Login([FromBody] LoginRequest req)
  {
    var valid = _userService.ValidateCredentials(req.Email, req.Password);
    if (!valid) return BadRequest(new { message = "Invalid credentials" });

    var user = _userService.GetUser(req.Email)!;
    var token = _jwtService.GenerateToken(user.Email);
    Response.Cookies.Append("auth_token", token, new CookieOptions
    {
      HttpOnly = true,
      Secure = false,
      SameSite = SameSiteMode.Lax
    });
    return Ok(new { token });
  }

  [HttpGet("is-authenticated")]
  [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
  public IActionResult IsAuthenticated()
  {
    return Ok(User?.Identity?.IsAuthenticated == true);
  }
}
