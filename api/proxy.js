// api/proxy.js
export default async function handler(req, res) {
    // 强制开启跨域许可
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const ONENET_CONFIG = {
        url: "https://iot-api.heclouds.com/thingmodel/query-device-property",
        token: "version=2018-10-31&res=products%2F3dG9zsAlWf%2Fdevices%2Ftest&et=1835337893&method=md5&sign=SRFj1BaCxpJRUXMkTTXRFQ%3D%3D",
        body: {
            product_id: "3dG9zsAlWf",
            device_name: "test"
        }
    };

    try {
        console.log("正在请求 OneNET...");
        const response = await fetch(ONENET_CONFIG.url, {
            method: 'POST',
            headers: {
                "authorization": ONENET_CONFIG.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ONENET_CONFIG.body)
        });

        const result = await response.json();
        
        // 如果 OneNET 返回了错误码，透传给前端方便排查
        if (result.code !== 0) {
            console.error("OneNET 业务错误:", result.msg);
            return res.status(200).json({ code: result.code, msg: result.msg, data: null });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("云函数崩溃详情:", error.message);
        return res.status(500).json({ 
            error: "云函数请求失败", 
            details: error.message 
        });
    }
}
