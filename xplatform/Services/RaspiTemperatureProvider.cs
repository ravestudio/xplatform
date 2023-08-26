using CommonLib.Objects;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Text.RegularExpressions;
using xplatform.Model;

namespace xplatform.Services
{
    public interface ITemperatureProvider
    {
        (double, string) GetTemperature();
    }
    public class RaspiTemperatureProvider: ITemperatureProvider
    {
        public (double, string) GetTemperature()
        {
            var fallbackValue = (double.NaN, "#");

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "vcgencmd",
                    Arguments = "measure_temp",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = false,
                }
            };

            process.Start();
            var standardOutput = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            var match = Regex.Match(standardOutput, @"temp=(\d+[,.]\d).{1}(.{1})");

            if (process.ExitCode != 0 || !match.Success)
            {

                return fallbackValue;
            }

            if (double.TryParse(match.Groups[1].Value, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
            {
                return (result, match.Groups[2].Value);
            }
            else
            {
                return fallbackValue;
            }
        }

    }
}
