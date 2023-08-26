using CommonLib.ISS;
using Microsoft.AspNetCore.Mvc;
using System;
using xplatform.Model;
using xplatform.Services;

namespace xplatform.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RaspiTemperatureController : ControllerBase
    {
        private ITemperatureProvider _temperatureProvider;
        public RaspiTemperatureController(ITemperatureProvider temperatureProvider)
        {
            _temperatureProvider = temperatureProvider;
        }
        public TemperatureInfo GetTemperature()
        {
            var values = _temperatureProvider.GetTemperature();


            return new TemperatureInfo()
            {
                t = values.Item1,
                unit= values.Item2
            };
        }
    }
}
