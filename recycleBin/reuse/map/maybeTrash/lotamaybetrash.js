// function profile() {
// 	const start = (new Date()).getTime();
// 	return () => console.log('took', (new Date()).getTime() - start, 'ms');
// }

// function diffuse(N, b, m, m0, diff, dt) {
// 	const a = dt * diff * N * N;
// 	for (let k = 0; k < 20; k++) {
// 		for (let i = 0; i < N; i++)
// 			for (let j = 0; j < N; j++)
// 				wSetSample(m, i, j,
// 					wSample(m0, i, j) + a * (
// 						wSample(m, i - 1, j) +
// 						wSample(m, i + 1, j) +
// 						wSample(m, i, j - 1) +
// 						wSample(m, i, j + 1)
// 					) / (1 + 4 * a)
// 				);
// 		// set_bnd(N, b, m);
// 	}
// }
// http://www.tophatstuff.co.uk/index.html@p=93.html
// https://en.wikipedia.org/wiki/Numerical_weather_prediction#/media/File:NOAA_Wavewatch_III_Sample_Forecast.gif
// http://www.dungeonleague.com/2010/03/28/wind-direction/
// Assuming, there is currently no wind (not a solid assumption), temperature is either directly or inversely proportional (depending if we are talking surface or high-altitude) to pressure. This is due to the equation PV = nRT. n, R and V are roughly proportional.
// And thus, it good initial value for making a good pressure map.
// For successive iterations, you would likely need to incorporate wind into pressure calculations to compensate for the assumption above.
// edit: as a source for temp -> pressure: The Climate Cookbook
// http://web.archive.org/web/20130619132254/http://jc.tech-galaxy.com/bricka/climate_cookbook.html
// relation between the difference of land and water temperature over the water temperature and the waterLevel
