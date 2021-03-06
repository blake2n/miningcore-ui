// Aionmine API Gateway
// Extended by Blake2n

// Product Page: https://github.com/blake2n/miningcore-ui
// Copyright 2018 Kim Patterson (http://aionmine.org)
// Licensed under MIT 

var API = 'https://api.aionmine.org/api/';
var defaultPool = 'aion';

var currentPool = defaultPool;

if (localStorage.pool =='') {localStorage.pool = 'aion';}

function _isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

// private function
function _formatter(value, decimal, unit) {
    if (value === 0) {
        return '0 ' + unit;
    } else {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
            { value: 1e21, symbol: "Z" },
            { value: 1e24, symbol: "Y" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
}

function loadPools(renderCallback) {
    $('#currentPool b').remove();
    $('#currentPool ul').remove();
    return $.ajax(API + 'pools')
        .done(function (data) {
            var poolList = '<ul class="dropdown-menu">';
            if (data.pools.length > 1) {
                $('#currentPool').attr('data-toggle', 'dropdown');
                $('#currentPool').append('<b class="caret"></b>');
            }
            $.each(data.pools, function (index, value) {
                if (currentPool.length === 0 && index === 0) {
                    currentPool = value.id;
                }

				if (localStorage.pool != undefined) {
					currentPool = localStorage.pool;
					} else {
						localStorage.pool = currentPool;
				}
				
				var poolName = ''
				if (value.id=='aiontest') { poolName = 'AION Testnet Mastry' }
				if (value.id=='aion') { poolName = 'AION'; }

                if (currentPool === value.id) {
                    $('#currentPool p').attr('data-id', value.id);
					$('#currentPool p').text(poolName);
                } else {
                    poolList += '<li><a href="javascript:void(0)" data-id="' + value.id + '">' + value.poolName + '</a></li>';
                }
            });

            poolList += '</ul>';
            if (poolList.length > 0) {
                $('#poolList').append(poolList);
            }
            if (data.pools.length > 1) {
                $('#poolList li a').on('click', function (event) {
                    currentPool = $(event.target).attr('data-id');
					localStorage.pool = currentPool;
                    loadPools(renderCallback);
                });
            }
            if (renderCallback.has()) {
                renderCallback.fire();
            }
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-info",
                message: "Error: No response from API.<br>(loadPools)",
            }, {
                type: 'info',
                timer: 3000,
            });
        });
}

function loadStatsData() {
    return $.ajax(API + 'pools')
        .done(function (data) {
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
					var PoolisOfPercent = ((value.poolStats.poolHashrate / value.networkStats.networkHashrate) * 100);
                    $('#poolShares').text(_formatter(value, 0, ''));
                    $('#poolMiners').text(_formatter(value.poolStats.connectedMiners, 0, ''));
                    $('#poolHashRate').text(_formatter(value.poolStats.poolHashrate, 2, 'Sols/s'));
                    $('#networkHashRate').text(_formatter(value.networkStats.networkHashrate, 5, 'Sols/s'));
                    $('#networkDifficulty').text(_formatter(value.networkStats.networkDifficulty, 5, ''));
					$('#sharesPerSecond').text(_formatter(value.poolStats.sharesPerSecond, 0, ''));
					$('#lastBlockHeight').text(value.networkStats.blockHeight);
					$('#totalPaid').text(value.totalPaid.toFixed(4) + ' AION');
					$('#payoutScheme').text(value.payoutScheme.toFixed(8) + ' AION');
                }
            });
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsData)",
            }, {
                type: 'info',
                timer: 3000,
            });
        });
}

function loadStatsChart() {
    return $.ajax(API + 'pools/' + currentPool + '/performance')
        .done(function (data) {
            labels = [];
            connectedMiners = [];
            networkHashRate = [];
            poolHashRate = [];
            $.each(data.stats, function (index, value) {
                if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                    labels.push(new Date(value.created).toISOString().slice(11, 16));
                } else {
                    labels.push('');
                }
                poolHashRate.push(value.poolHashrate);
                connectedMiners.push(value.connectedMiners);
            });

            var data = {
                labels: labels,
                series: [
                    poolHashRate,
                ],
            };

            var options = {
                showArea: true,
                height: "245px",
                axisX: {
                    showGrid: false,
                },
                axisY: {
                    offset: 47,
                    labelInterpolationFnc: function(value) {
                        return _formatter(value, 1, '');
                    }
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2,
                }),
            };

            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    },
                }],
            ];

            Chartist.Line('#chartStatsHashRate', data, options, responsiveOptions);
            var data = {
                labels: labels,
                series: [
                    connectedMiners,
                ],
            };
            var options = {
                height: "245px",
                axisX: {
                    showGrid: false,
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2,
                }),
            };
            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    },
                }],
            ];

            Chartist.Line('#chartStatsMiners', data, options, responsiveOptions);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsChart)",
            }, {
                type: 'info',
                timer: 3000,
            });
        });
}

//do not delete the following lines OR ui will not load in internet explorer
//IE compatability key: AdlkInasONaawMaswIsaNEdsOdsaRGnas23225

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
//Distribution, use of excerpts, or references for codebase requires reference or mention the following list of contibiuters
//Blake2n (Blake Masters), Kryptostuff, aionmine.org, Daryl Hansel, Morgan Jones, Kim Patterson, Akatsuki, Clive Saunders, CalvinTam236, Creative Tim