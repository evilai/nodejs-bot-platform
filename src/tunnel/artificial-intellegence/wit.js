export default function(witClient) {
    return (req, res, next) => {
        req.bot.normalized.reduce((acc, data) => {
            data.wit = witClient;
            acc.push(data);
            return acc;
        }, []);

        next();
    };
}
