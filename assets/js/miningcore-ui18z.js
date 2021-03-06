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
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadPools)",
            }, {
                type: 'info',
                timer: 3000,
            });
        });
}

function loadaionmineBlocksList() {
    return $.ajax(API + 'pools/' + currentPool + '/blocks?pageSize=500')
        .done(function (data) {
	console.log(data)
            var aionmineblockList = '';
	        var blockaddress = "https://mainnet.aion.network/#/block/";
			var aionaddress = "https://mainnet.aion.network/#/account/";
			var orphaned = 0;
			var confirmed = 0;
			var pending = 0;
			var orphaned1 = 0;
			var confirmed1 = 0;
			var pending1 = 0;
			var orphaned2 = 0;
			var confirmed2 = 0;
			var pending2 = 0;
			var orphaned3 = 0;
			var confirmed3 = 0;
			var pending3 = 0;
			var orphaned4 = 0;
			var confirmed4 = 0;
			var pending4 = 0;
			var totalblocks = 0;
			var partpoint1 = 100;
			var partpoint2 = 200;
			var partpoint3 = 300;
			var partpoint4 = 400;
			var partpoint5 = 500;
			var blockstatus = 'notset';
			var combinedeffort = 0;
			var combinedeffort1 = 0;
			var combinedeffort2 = 0;
			var combinedeffort3 = 0;
			var combinedeffort4 = 0;
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    if (typeof(value.effort) !== "undefined") {
                        
						if (blockstatus != 'pending')
						{
							combinedeffort = combinedeffort + value.effort;
						}
                    } else {
                        
                    }
					blockstatus = value.status;
					if (blockstatus === 'confirmed')
					{
						confirmed = confirmed + 1;
						totalblocks = totalblocks + 1;
					} else if (blockstatus === 'pending')
					{
						pending = pending + 1;
						totalblocks = totalblocks + 1;						
					} else if (blockstatus === 'orphaned')
					{
						orphaned = orphaned + 1;
						totalblocks = totalblocks + 1;
					} else
					{
						aionmineblockList += '';
					}
                    aionmineblockList += '';
					if (partpoint1 === totalblocks)
					{
						orphaned1 = orphaned;
						pending1 = pending;
						confirmed1 = confirmed;
						combinedeffort1 = combinedeffort;
					}
					if (partpoint2 === totalblocks)
					{
						orphaned2 = (orphaned - orphaned1);
						pending2 = (pending - pending1);
						confirmed2 = (confirmed - confirmed1);
						combinedeffort2 = (combinedeffort - combinedeffort1);
					}
					if (partpoint3 === totalblocks)
					{
						orphaned3 = (orphaned - (orphaned1 + orphaned2));
						pending3 = (pending - (pending1 + pending2));
						confirmed3 = (confirmed - (confirmed1 + confirmed2));
						combinedeffort3 = (combinedeffort - (combinedeffort1 + combinedeffort2));
					}
					if (partpoint4 === totalblocks)
					{
						orphaned4 = (orphaned - (orphaned1 + orphaned2 + orphaned3));
						pending4 = (pending - (pending1 + pending2 + pending3));
						confirmed4 = (confirmed - (confirmed1 + confirmed2 + confirmed3));
						combinedeffort4 = (combinedeffort - (combinedeffort1 + combinedeffort2 + combinedeffort3))
					}
					if (partpoint5 === totalblocks)
					{
						orphaned5 = (orphaned - (orphaned1 + orphaned2 + orphaned3 + orphaned4));
						pending5 = (pending - (pending1 + pending2 + pending3 + pending4));
						confirmed5 = (confirmed - (confirmed1 + confirmed2 + confirmed3 + confirmed4));
						combinedeffort5 = (combinedeffort - (combinedeffort1 + combinedeffort2 + combinedeffort3 + combinedeffort4))
					}
                });
            } else {
                aionmineblockList += '<tr><td colspan="7">No Pending Blocks</td></tr>';
            }
			var percentpend = (pending / totalblocks * 100).toFixed(1);
			var percentpend1 = (pending1 / partpoint1 * 100).toFixed(1);
			var percentpend2 = (pending2 / (partpoint2 - partpoint1) * 100).toFixed(1);
			var percentpend3 = (pending3 / (partpoint3 - partpoint2) * 100).toFixed(1);
			var percentpend4 = (pending4 / (partpoint4 - partpoint3) * 100).toFixed(1);
			var percentpend5 = (pending5 / (partpoint5 - partpoint4) * 100).toFixed(1);
			var percentorphan = (orphaned / totalblocks * 100).toFixed(1);
			var percentorphan1 = (orphaned1 / partpoint1 * 100).toFixed(1);
			var percentorphan2 = (orphaned2 / (partpoint2 - partpoint1) * 100).toFixed(1);
			var percentorphan3 = (orphaned3 / (partpoint3 - partpoint2) * 100).toFixed(1);
			var percentorphan4 = (orphaned4 / (partpoint4 - partpoint3) * 100).toFixed(1);
			var percentorphan5 = (orphaned5 / (partpoint5 - partpoint4) * 100).toFixed(1);
			var percentconfirm = (confirmed / totalblocks * 100).toFixed(1);
			var percentconfirm1 = (confirmed1 / partpoint1 * 100).toFixed(1);
			var percentconfirm2 = (confirmed2 / (partpoint2 - partpoint1) * 100).toFixed(1);
			var percentconfirm3 = (confirmed3 / (partpoint3 - partpoint2) * 100).toFixed(1);
			var percentconfirm4 = (confirmed4 / (partpoint4 - partpoint3) * 100).toFixed(1);
			var percentconfirm5 = (confirmed5 / (partpoint5 - partpoint4) * 100).toFixed(1);
			var averageeffort = (combinedeffort / (totalblocks - (pending)) * 100).toFixed(2);
			var averageeffort1 = (combinedeffort1 / (partpoint1 - (pending1)) * 100).toFixed(2);
			var averageeffort2 = (combinedeffort2 / (partpoint2 - (partpoint1 + pending2)) * 100).toFixed(2);
			var averageeffort3 = (combinedeffort3 / (partpoint3 - (partpoint2 + pending3)) * 100).toFixed(2);
			var averageeffort4 = (combinedeffort4 / (partpoint4 - (partpoint3 + pending4)) * 100).toFixed(2);
			var averageeffort5 = (combinedeffort5 / (partpoint5 - (partpoint4 + pending5)) * 100).toFixed(2);
			    aionmineblockList += '<tr>';
				aionmineblockList += '<td colspan="7" align="center">';
			    aionmineblockList += '<table>';
				aionmineblockList += '<tbody>';
			    aionmineblockList += '<hr>';
				aionmineblockList += '<td>&nbsp Last Blocks &nbsp</td><td>&nbsp Blocks Pending &nbsp</td><td>&nbsp Blocks Confirmed &nbsp</td><td>&nbsp Blocks Orphaned &nbsp</td><td>&nbsp Average Effort &nbsp</td>';
			    aionmineblockList += '</hr>';
			    aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">1 - ' + partpoint1 + '</td>';
				aionmineblockList += '<td align="center">' + pending1 + ' (' + percentpend1 + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed1 + ' (' + percentconfirm1 + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned1 + ' (' + percentorphan1 + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort1 + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">' + (partpoint1 + 1) + ' - ' + partpoint2 + '</td>';
				aionmineblockList += '<td align="center">' + pending2 + ' (' + percentpend2 + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed2 + ' (' + percentconfirm2 + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned2 + ' (' + percentorphan2 + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort2 + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">' + (partpoint2 + 1) + ' - ' + partpoint3 + '</td>';
				aionmineblockList += '<td align="center">' + pending3 + ' (' + percentpend3 + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed3 + ' (' + percentconfirm3 + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned3 + ' (' + percentorphan3 + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort3 + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">' + (partpoint3 + 1) + ' - ' + partpoint4 + '</td>';
				aionmineblockList += '<td align="center">' + pending4 + ' (' + percentpend4 + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed4 + ' (' + percentconfirm4 + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned4 + ' (' + percentorphan4 + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort4 + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">' + (partpoint4 + 1) + ' - ' + totalblocks + '</td>';
				aionmineblockList += '<td align="center">' + pending5 + ' (' + percentpend5 + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed5 + ' (' + percentconfirm5 + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned5 + ' (' + percentorphan5 + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort5 + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '<tr>';
				aionmineblockList += '<td align="center">last ' + totalblocks + '</td>';
				aionmineblockList += '<td align="center">' + pending + ' (' + percentpend + '%)</td>';
				aionmineblockList += '<td align="center">' + confirmed + ' (' + percentconfirm + '%)</td>';
				aionmineblockList += '<td align="center">' + orphaned + ' (' + percentorphan + '%)</td>';
				aionmineblockList += '<td align="center">' + averageeffort + '%</td>';
				aionmineblockList += '</tr>';
				aionmineblockList += '</tbody>';
				aionmineblockList += '</table>';
				aionmineblockList += '<p align="center"><br />If you are bored <b>Copy</b> our above <i>table</i> <b>N-paste-A</b> it into your own interface!!!</p>';
				aionmineblockList += '</td>';
				aionmineblockList += '</tr>';
            aionmineblockList += '</tbody>';

            $('#aionmineblockList').html(aionmineblockList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadpendingBlocksList)",
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