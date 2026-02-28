// api/proxy.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 修正：确保 Token 字符串完整且没有多余空格
    const token = "version=2018-10-31&res=products%2F3dG9zsAlWf%2Fdevices%2Ftest&et=1835337893&method=md5&sign=SRFj1BaCxpJRUXMkTTXRFQ%3D%3D";
    
    try {
        const response = await fetch("https://iot-api.heclouds.com/thingmodel/query-device-property", {
            method: 'POST',
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: "3dG9zsAlWf",
                device_name: "test"
            })
        });

        const rawText = await response.text(); // 先取原始文本，防止解析崩溃
        
        try {
            const data = JSON.parse(rawText);
            return res.status(200).json(data);
        } catch (e) {
            // 如果 OneNET 返回的不是 JSON，说明是 Token 或权限问题
            return res.status(200).json({ code: -1, msg: "OneNET响应格式异常", detail: rawText });
        }
    } catch (error) {
        return res.status(500).json({ error: "云函数请求失败", details: error.message });
    }
}
