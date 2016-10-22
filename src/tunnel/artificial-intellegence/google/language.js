export default function(googleNaturalLanguageClient) {
    return function(req, res, next) {
        req.bot.normalized.reduce((acc, data) => {
            data.googleLanguage = googleNaturalLanguageClient();
            acc.push(data);
            return acc;
        }, []);

        next();
    }
}
