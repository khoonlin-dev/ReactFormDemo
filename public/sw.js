self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(MockedServer.fakeDbName));
});

self.addEventListener("fetch", async (event) => {
    switch (event.request.url) {
        case "https://api/revenue/get": {
            event.respondWith(MockedServer.getGroup());
            break;
        }
        case "https://api/revenue/add": {
            event.respondWith(MockedServer.addGroup(event.request));
            break;
        }
        case "https://api/revenue/remove": {
            event.respondWith(MockedServer.removeGroup(event.request));
            break;
        }
        case "https://api/rule/remove": {
            event.respondWith(MockedServer.removeRule(event.request));
            break;
        }
        default: {
            return fetch(event.request.url);
        }
    }
});

const MockedServer = {
    // Establish a cache name
    fakeDbName: "revenue",
    badResponse: new Response(undefined, {
        status: 400,
        statusText: "not ok",
        ok: false,
        redirected: false,
    }),
    getGroup: function () {
        return caches.open(this.fakeDbName).then((cache) => {
            return cache.match("revenue").then((revenue) => {
                if (revenue !== undefined) {
                    return revenue.clone();
                } else {
                    const response = new Response("[]", {
                        status: 200,
                        statusText: "ok",
                        ok: true,
                        redirected: false,
                    });
                    response.clone();
                    return cache
                        .put("revenue", response.clone())
                        .then(() => response);
                }
            });
        });
    },

    addGroup: function (request) {
        if (request.headers.has("payload")) {
            const payload = request.headers.get("payload");
            const newObject = JSON.parse(payload);
            return caches.open(this.fakeDbName).then((cache) => {
                return cache.match("revenue").then(async (revenue) => {
                    let fullRevenue;
                    if (revenue) {
                        fullRevenue = await revenue.json();
                        fullRevenue.push(newObject);
                    } else {
                        fullRevenue = [newObject];
                    }
                    await cache.put(
                        "revenue",
                        new Response(JSON.stringify(fullRevenue), {
                            status: 200,
                            statusText: "ok",
                            ok: true,
                            redirected: false,
                        })
                    );
                    return new Response(payload, {
                        status: 200,
                        statusText: "ok",
                        ok: true,
                        redirected: false,
                    });
                });
            });
        }
        return this.badResponse.clone();
    },

    removeGroup: function (request) {
        if (request.headers.has("payload")) {
            const payload = +request.headers.get("payload");
            if (typeof payload === "number") {
                return caches.open(this.fakeDbName).then((cache) => {
                    return cache.match("revenue").then(async (revenue) => {
                        let fullRevenue;
                        if (revenue) {
                            fullRevenue = await revenue.json();
                        } else {
                            fullRevenue = [];
                        }
                        if (fullRevenue[payload] !== undefined) {
                            fullRevenue.splice(payload, 1);
                            const newResponse = new Response(
                                JSON.stringify(fullRevenue),
                                {
                                    status: 200,
                                    statusText: "ok",
                                    ok: true,
                                    redirected: false,
                                }
                            );
                            await cache.put("revenue", newResponse.clone());
                            return newResponse;
                        } else {
                            return new Response(JSON.stringify(fullRevenue), {
                                status: 400,
                                statusText: "not ok",
                                ok: false,
                                redirected: false,
                            });
                        }
                    });
                });
            }
            return this.badResponse.clone();
        }
        return this.badResponse.clone();
    },

    removeRule: function (request) {
        if (request.headers.has("payload")) {
            const payload = JSON.parse(request.headers.get("payload"));
            const groupIndex = +payload.groupIndex;
            const ruleIndex = +payload.ruleIndex;
            if (groupIndex !== undefined && ruleIndex !== undefined) {
                return caches.open(this.fakeDbName).then((cache) => {
                    return cache.match("revenue").then(async (revenue) => {
                        let fullRevenue;
                        if (revenue) {
                            fullRevenue = await revenue.json();
                        } else {
                            fullRevenue = [];
                        }

                        if (
                            fullRevenue[groupIndex] !== undefined &&
                            fullRevenue[groupIndex].rules[ruleIndex] !==
                                undefined
                        ) {
                            fullRevenue[groupIndex].rules.splice(ruleIndex, 1);
                            const newResponse = new Response(
                                JSON.stringify(fullRevenue),
                                {
                                    status: 200,
                                    statusText: "ok",
                                    ok: true,
                                    redirected: false,
                                }
                            );
                            await cache.put("revenue", newResponse.clone());
                            return newResponse;
                        } else {
                            return this.badResponse.clone();
                        }
                    });
                });
            }
            return this.badResponse.clone();
        }
        return this.badResponse.clone();
    },
};
