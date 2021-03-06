/*
 * index.js
 *
 * This file is part of libirc-client
 * © Copyright Massimo Neri 2014 <hello@mneri.me>
 *
 * This library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library. If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

var irc = require('../lib/index.js'),
    connection,
    options = {
        host: 'irc.freenode.net',
        nick: 'bot' + parseInt(Math.random() * 1000),
        user: 'jdoe',
        real: 'John Doe',
	secure: true
    };

connection = new irc.Connection(options);
connection.start();

// There are 3 main events: connect (when the connection starts), register (when
// the registration process ends) and close (when the connection is being
// closed)

// Autojoin a channel.
connection.on('register', function () {
    connection.join('#bots515');
});

// Every message generates an event. The first parameter is always an object
// that describes the sender of the message (nick, user, host), the subsequent
// parameters are the ones specified by the RFC. For example, PRIVMSG (as in
// https://tools.ietf.org/html/rfc2812#section-3.3.1) receives two extra
// parameters: the receiver of the message and the text; JOIN (as in
// https://tools.ietf.org/html/rfc2812#section-3.2.1) receives one extra
// parameter: the channel the user joined.

// If the nickname is already in use we pick another random one
connection.on('err_nicknameinuse', function () {
    connection.nick('bot' + parseInt(Math.random() * 1000));
});

connection.on('error', function (from, error) {
    console.log(error);
});

// Every time a user join a channel we say hello.
connection.on('join', function (from, channel) {
    var message;

    if (from.nick == connection.nick()) {
        console.log('I joined #bots515');
    } else {
        console.log(from.nick + ' joined #bots');
        message = 'Hello, ' + from.nick + '!';
        connection.privmsg('#bots515', message);
        console.log(message);
    }
});

// Log the messages from the server
connection.on('notice', function (from, to, message) {
    console.log(from.nick + ': ' + message);
});

// Log the messages from the users
connection.on('privmsg', function (from, to, message) {
    console.log(from.nick + ': ' + message);
});
