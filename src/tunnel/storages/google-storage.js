export default function(client) {
    return (req, res, next) => {
        req.bot.normalized.reduce((acc, data) => {
            data.gstorage = client(data.sender.id, data.recipient.id);
            acc.push(data);
            return acc;
        }, []);

        next();
    };
}
