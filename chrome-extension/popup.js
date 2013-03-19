var duration = {
    unit: 'minutes',
    value: 10
};

document.addEventListener('DOMContentLoaded', function () {

    var $body = bonzo(document.body);

    chrome.tabs.query({'active': true, 'currentWindow': true},
       function(tabs){
            var tab = tabs[0];
                $title = bonzo(document.createElement('p'))
                    .addClass('lead text-info')
                    .text(tab.title);
            $body.append($title);

            var $loading = bonzo(document.createElement('div'))
                .addClass('loading');
            $body.append($loading);

            // pull in hits in the last n mins from ophan
            var query = {         
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    url: tab.url
                                }
                            },
                            {
                                range:{
                                    dt:{
                                        from: moment().subtract(duration.unit, duration.value).valueOf(),
                                        to: moment().valueOf()
                                    }
                                }
                            }
                        ]
                    }
                },
                facets: {
                    referrers: {
                        terms: {
                            field: 'referringHost',
                            size: 5
                        }
                    }
                },
                size: 0,
                stats: ['frontend-dashboard']
            };

            reqwest({
                url: 'http://frontend-es.ophan.co.uk:9200/_search',
                type: 'json',
                method: 'post',
                data: JSON.stringify(query)
            })
            .then(
                function(resp) {
                    var hits = resp.hits.total,
                        perSec = (hits / (duration.value * 60)).toFixed(2),
                        $hits = bonzo(document.createElement('p'))
                            .html('<strong>' + hits + '</strong> hits in the last ' + duration.value + ' ' + duration.unit + ' (' + perSec + '/sec)');
                    $body.append($hits);

                    var $referrersList = bonzo(document.createElement('ol'));
                    $body.append($referrersList);

                    resp.facets.referrers.terms.forEach(function(referrer) {
                        var percentage = ((100 / hits) * referrer.count).toFixed(2),
                            $referrer = bonzo(document.createElement('p'))
                                .html(percentage + '% of those were from ' + '<strong>' + referrer.term + '</strong>');

                        $referrersList.append(bonzo(document.createElement('li')).append($referrer));
                    })
                }, 
                function(e) {
                    console.log(e); 
                }
            )
            .always(
                function() {
                    $loading.remove();
                }
            );
       }
    );
});