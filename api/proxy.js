export default async function handler(req, res) {
    // 允许跨域请求头，确保前端网页能读取数据
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 你的 OneNET 配置信息
    const ONENET_TOKEN = "version=2018-10-31&res=products%2F3dG9zsAlWf%2Fdevices%2Ftest&et=1835337893&method=md5&sign=SRFj1BaCxpJRUXMkTTXRFQ%3D%3D";
    const ONENET_URL = "https://iot-api.heclouds.com/thingmodel/query-device-property";

    try {
        const response = await fetch(ONENET_URL, {
            method: 'POST',
            headers: {
                "Authorization": ONENET_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: "3dG9zsAlWf",
                device_name: "test"
            })
        });

        const text = await response.text();
        
        try {
            // 尝试解析 JSON，如果解析失败则返回原始错误文本
            const data = JSON.parse(text);
            return res.status(200).json(data);
        } catch (e) {
            return res.status(200).json({ code: -1, msg: "OneNET数据格式非JSON", detail: text });
        }
    } catch (error) {
        return res.status(500).json({ error: "服务器中转失败", details: error.message });
    }
}
