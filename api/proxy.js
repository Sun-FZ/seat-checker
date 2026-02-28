// api/proxy.js
export default async function handler(req, res) {
    // 允许跨域头信息
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 你的 OneNET 配置信息
    const token = "version=2018-10-31&res=products%2F3dG9zsAlWf%2Fdevices%2Ftest&et=1835337893&method=md5&sign=SRFj1BaCxpJRUXMkTTXRFQ%3D%3D";
    const url = "https://iot-api.heclouds.com/thingmodel/query-device-property";

    try {
        const response = await fetch(url, {
            method: 'POST', // OneNET 规范要求 POST
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: "3dG9zsAlWf", // 确认是小写L
                device_name: "test"
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "代理请求 OneNET 失败" });
    }
}
