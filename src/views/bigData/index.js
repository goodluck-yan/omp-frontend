 
var token = "68649f8cd85851f42182facbbb51308b";

//获取登录信息
function GetToken() {
 
    $("#token").val(token);
    $("#dataTile").text(token);
    console.log($("#token").val())
    console.log("gettoken")
    alert('jjj')
    // var data = {
       
    // };
 
    // $.ajax({
    //     type: "POST",
    //     url: "/Home/GetToken",
    //     data: data,
    //     dataType: "json",
    //     success: function (re) {
    //         var data = JSON.parse(re);
    //         console.log(data);
    //         token = data.result;
    //         $("#token").val(data.result);
    //         $("#dataTile").text(data.result);
    //     }
    // });
}
//获取监控设备列表
function GetDevice() {
    var json = {
        "jsonrpc": "2.0",
        "method": "host.get",
        "params": {
            "output": "extend",
        },
        "id": 1,
        "auth": $("#token").val()
    };
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(json) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
            if (data.result.length > 0) {
                var htmlstr = '';
                console.log(data.result);
                $.each(data.result, function (index, e) {
                    htmlstr += ' <option value="' + e.hostid + '">' + e.name + '</option>';
                });
                $("#service").html(htmlstr);
            }
        }
    });
    //$("#showdata").text(JSON.parse(data).result);
 
}
//获取警报
function GetDeviceAlert() {
    var json = {
        "jsonrpc": "2.0",
        "method": "alert.get",
        "params": {
            "output": "extend",
            "actionids": 0
        },
        "id": 1,
        "auth": $("#token").val()
    };
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(json) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
 
        }
    });
}
//获取监控项 
function GetDeviceTemplateid() {
    var hostid = $("#service").val();
   
//监控项的key 是 zabbix 中配置的 具体见下图
    //system.cpu.util[,user]  每分钟CPU使用率
    //vm.memory.size[pused]  内存
    //vfs.fs.size[/,pused] 硬盘
    //agent.ping  是否存活
 
//cpu 使用率
    var jsoncpu = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "output": "itemids",
            "hostids": hostid,
            "search": {
                "key_": "system.cpu.util[,user]"
            }
        },
        "auth": $("#token").val(),
        "id": 1
    }
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(jsoncpu) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
            $.each(data.result, function (i, e) {
                GetDeviceInfo(e.itemid, "CPU 使用率", "cpu");
            });
        }
    });
 
 
//内存使用率
    var jsonmemory = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "output": "itemids",
            "hostids": hostid,
            "search": {
                "key_": "vm.memory.size[pused]"
            }
        },
        "auth": $("#token").val(),
        "id": 1
    }
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(jsonmemory) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
            $.each(data.result, function (i, e) {
                GetDeviceInfo(e.itemid, "内存 使用率", "memory");
            });
        }
    });
 
//硬盘使用率
    var jsonfs = {
        "jsonrpc": "2.0",
        "method": "item.get",
        "params": {
            "output": "itemids",
            "hostids": hostid,
            "search": {
                "key_": "vfs.fs.size[/,pused]"
            }
        },
        "auth": $("#token").val(),
        "id": 1
    }
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(jsonfs) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
            $.each(data.result, function (i, e) {
                GetDeviceInfo(e.itemid, "硬盘 使用率", "fs");
            });
        }
    });
 
}
// 根据 监控项ID 获取监控数据
function GetDeviceInfo(itemids, name, idname) {
    var hostid = $("#service").val();
   
 
    var json = {
        "jsonrpc": "2.0",
        "method": "history.get",
        "params": {
            "output": "extend",
            "history": 0,
            "itemids": itemids,
            "sortfield": "clock",
            "sortorder": "DESC",
            "limit": 10
        },
        "auth": $("#token").val(),
        "id": 1
    };
 
    $.ajax({
        type: "POST",
        url: "/Home/GetData",
        data: { "json": JSON.stringify(json) },
        dataType: "json",
        async: false,
        success: function (re) {
            var data = $.parseJSON(re);
            console.log(data);
            $("#" + idname).html("");
            $("#" + idname).append(name + "</br>");
            $.each(data.result, function (i, e) {
                var date2 = timestampToTime(parseInt(e.clock));
                $("#" + idname).append("时间：" + date2);
                $("#" + idname).append("  使用率：" + e.value + "%</br>");
            });
 
        }
    });
 
 
 
}
 
 
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
//获取网路数据
function GetDataInfo() {
    var hostid = $("#service").val();
    var keys = ["net.if.in[ens192,bytes]", "net.if.out[ens192,bytes]", "net.if.total[ens192,bytes]"];
    var itemids = new Array();
    $.each(keys, function (i, item) {
        var jsonfs = {
            "jsonrpc": "2.0",
            "method": "item.get",
            "params": {
                "output": "itemids",
                "hostids": hostid,
                "search": {
                    "key_": item
                }
            },
            "auth": $("#token").val(),
            "id": 1
        }
 
        $.ajax({
            type: "POST",
            url: "/Home/GetData",
            data: { "json": JSON.stringify(jsonfs) },
            dataType: "json",
            async: false,
            success: function (re) {
                var data = $.parseJSON(re);
                console.log(data);
                $.each(data.result, function (i, e) {
                    itemids.push(e.itemid);
                });
            }
        });
    });
    GetNetInfo(itemids, "网络", "net");
 
 
 
}
//获取网络数据  并运算
function GetNetInfo(itemids, name, idname) {
    var netdatas = new Array();
    $.each(itemids, function (i, item) {
        var json = {
            "jsonrpc": "2.0",
            "method": "history.get",
            "params": {
 
                "itemids": [
                    item
                ],
                "limit": "10",
                "sortfield": "clock",
                "sortorder": "DESC",
            },
            "auth": $("#token").val(),
            "id": 1
        }
 
        
        $.ajax({
            type: "POST",
            url: "/Home/GetData",
            data: { "json": JSON.stringify(json) },
            dataType: "json",
            async: false,
            success: function (re) {
                var data = $.parseJSON(re);
                var count = 0;
                for (var i = 0; i < data.result.length; i++) {
                    var countTemporary = data.result[i].value;
                    if (i != 0) {
                        data.result[i].value = parseInt((count - parseInt(data.result[i].value)) / 1024) + "KB  ";
                        
                    }
                    count = countTemporary;
                    
                }
                netdatas.push(data);
                console.log(data);
                
               
 
            }
        });
    });
    $("#" + idname).html("");
    $("#" + idname).append(name + "</br>");
    console.log("netdatas"+netdatas);
    $.each(netdatas[0].result, function (i, e) {
        var date2 = timestampToTime(parseInt(e.clock));
 
        if (i != 0) {
            $("#" + idname).append("时间：" + date2);
            $("#" + idname).append(" 请求流量 ：" +  e.value);
        
        $.each(netdatas[1].result, function (ii, ee) {
            if (ee.clock == e.clock) {
                $("#" + idname).append(" 响应流量 ：" +  ee.value);
            }
            });
 
        
 
        $.each(netdatas[2].result, function (iii, eee) {
            if (eee.clock == e.clock) {
                $("#" + idname).append(" 总流量 ：" + eee.value);
            }
        });
            $("#" + idname).append(" </br>");
    }
 
      
    });
 
 
 
    
}