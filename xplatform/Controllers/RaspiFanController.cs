using CommonLib.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Device.Gpio;
using System.Threading;
using xplatform.Helpers;
using xplatform.Model;

namespace xplatform.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RaspiFanController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        public RaspiFanController(IOptions<AppSettings> appSettings) {
            _appSettings = appSettings.Value;
        }

        public bool Get()
        {
            int GpioPin = _appSettings.GpioPin;

            var gpioController = new GpioController();
            gpioController.OpenPin(GpioPin, PinMode.Input);
            var initialValue = gpioController.Read(GpioPin) == PinValue.High;

            return initialValue;
        }

        [HttpPost]
        public IActionResult Post([FromBody] RaspiFanRequest request)
        {
            int GpioPin = _appSettings.GpioPin;
            //int GpioPin = 14;

            var gpioController = new GpioController();
            gpioController.OpenPin(GpioPin, PinMode.Output);

            if (request.cmd == "turnon") {
                gpioController.Write(GpioPin, PinValue.High);
            }

            if (request.cmd == "turnoff")
            {
                gpioController.Write(GpioPin, PinValue.Low);
            }

            return Ok();

        }

    }
}
