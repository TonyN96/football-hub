const formatter = ({
    /* Function which formats the team names to a less formal name */
    formatName(teamName) {
        let name = teamName;
        if (name.includes(" FC")) {
            name = name.replace(" FC", "");
        }
        if (name == "Brighton & Hove Albion") {
            name = "Brighton";
        }
        if (name == "West Ham United") {
            name = "West Ham";
        }
        if (name == "Tottenham Hotspur") {
            name = "Spurs";
        }
        if (name == "Leeds United") {
            name = "Leeds";
        }
        if (name == "Wolverhampton Wanderers") {
            name = "Wolves";
        }
        if (name == "Newcastle United") {
            name = "Newcastle";
        }
        if (name == "West Bromwich Albion") {
            name = "West Brom";
        }
    return name;   
    },

    /* Function which formats the date to a more readable format */
    formatDate(date) {
        formattedDate = ("0" + date.getDate()).slice(-2) + "-"
        + (("0" + (date.getMonth() + 1)).slice(-2)) + "-"
        + date.getFullYear() + " "
        + ("0" + date.getHours()).slice(-2) + ":"
        + ("0" + date.getMinutes()).slice(-2);
        return formattedDate;
    }
});

module.exports = formatter;