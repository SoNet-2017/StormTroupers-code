# StormTroupers-code

Buongiorno,
usiamo il README per ricordarci le credenziali d'accesso: lo username è "otto@tedesco.de" e la password è "ottone".
Se volete testarla la funzionalità d'iscrizione funziona anche se per semplicità abbiamo limitato la selezione funzionante delle
province con cui è possibilie iscriversi a quella di Torino e alle sue città.

FUNZIONALITA' IMPERFETTE:

Nelle ricerche (Search Crew e Search Project) i campi City e Range NON funzionano insieme. Non siamo riusciti a implementare una ricerca
che parta in modo asincrono dopo aver aspettato una risposta (sotto forma di file .json) da un server.

Per motivi a noi ignoti la barra di ricerca della navbar funziona quasi sempre, a volte invece no. Crediamo sia legato di nuovo a problemi
di caricamento asincrono da firebase.

La console restituisce degli errori da googleapis relativi alla chiave ma anche sostituendola con una nuova ottenuta da Google selezionando
il nostro progetto continua a dare lo stesso errore.