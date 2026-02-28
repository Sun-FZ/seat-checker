// api/proxy.js
export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const url = "https://iot-api.heclouds.com/thingmodel/query-device-property";
    const body = {
        product_id: "3dG9zsAlWf",
        device_name: "test"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "authorization": "version=2018-10-31&res=products%2F3dG9zsAlWf%2Fdevices%2Ftest&et=1835337893&method=md5&sign=SRFj1BaCxpJRUXMkTTXRFQ%3D%3D",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        // 关键点：检查响应是否正常
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: "OneNET报错", detail: errorText });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "云函数内部故障", message: error.message });
    }
}
