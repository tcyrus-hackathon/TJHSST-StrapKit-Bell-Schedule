var StrapKit=require('strapkit');
var parseFeed=function(data) {
    var items=[];
    data.schedule.period.forEach(function(period) {
      items.push({title:period.name,subtitle:period.times.start+" - "+period.times.end});
    });
    return items;
};
//var app_id="bXeXzMSYRNe4HN8Zh";
//StrapKit.Metrics.Init(app_id);
// Show splash screen while waiting for data
var splashPage=StrapKit.UI.Page();
// Text element to inform user
var card=StrapKit.UI.TextView({
    position:'center',
    text:'Loading Bell Schedule...'
});
// Add to splashPage and show
splashPage.addView(card);
splashPage.show();
// Make request to iodine
StrapKit.HttpClient({url:'https://iodine.tjhsst.edu/ajax/dayschedule/json',type:'json'},function(data) {
    // Get the type of Schedule
    var dayType=data.dayname;
    // Create an array of Periods
    var menuItems=parseFeed(data);
    var resultsPage=StrapKit.UI.Page();
    if (0===Object.keys(menuItems).length) {
        // Construct Card to show to user
        var resultUI=StrapKit.UI.Card({
            title:dayType,
            body:"No Periods Available"
        });
    } else {
        // Construct Menu to show to user
        var resultUI=StrapKit.UI.ListView({
            title:dayType,
            items:menuItems
        });
        // Add an action for SELECT
        resultUI.setOnItemClick(function(e) {
            var detailPage=StrapKit.UI.Page();
            // Create the Card for detailed view
            var detailCard=StrapKit.UI.Card({
                title:e.item.title,
                body:e.item.subtitle
            });
            detailPage.addView(detailCard);
            detailPage.show();
        });
    }
    // Show the UI, hide the splash
    resultsPage.addView(resultUI);
    resultsPage.show();
}, function(error) {
    console.log(error);
});
