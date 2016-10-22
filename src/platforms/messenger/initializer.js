export default function(platformName) {
    return (req, res, next) => {
        req.bot = {
            platform: platformName
        };

        next();
    };
}
