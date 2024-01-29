npm start

proporcje obrazków 1:1 16:9
rozmiary obrazków 
karuzela głowne okno index - 440x227(16:9)

galeria - kafelki - wszystkie produkty 400:400(1:1)
z galerii jeden produkt - karuzelka 800:454(16:9)
440x248(16:9)
800x450(16:9)

!-- Favicons -->
<link rel="apple-touch-icon" href="/docs/5.0/assets/img/favicons/apple-touch-icon.png" sizes="180x180">
<link rel="icon" href="/docs/5.0/assets/img/favicons/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/docs/5.0/assets/img/favicons/favicon-16x16.png" sizes="16x16" type="image/png">
<link rel="manifest" href="/docs/5.0/assets/img/favicons/manifest.json">
<link rel="mask-icon" href="/docs/5.0/assets/img/favicons/safari-pinned-tab.svg" color="#7952b3">
<link rel="icon" href="/docs/5.0/assets/img/favicons/favicon.ico">
<meta name="theme-color" content="#7952b3">


halter zwykły – 49 zł (pleciony nachrapnik +20 zł, kółeczka do wodzy +12 zł)
halter zwykły (Elana/multicolor)– 55 zł (pleciony nachrapnik +20 zł, kółeczka do wodzy +12 zł)
wodze lekkie 2,8m – 85 zł (z karabińczykami ze stali nierdzewnej  115 zł)
wodze  ciężkie 2,8m – 110 zł (z karabińczykami ze stali nierdzewnej  135 zł)
wodze west dzielone lekkie 2x2m – 105 zł (z karabińczykami ze stali nierdzewnej  130 zł)
wodze west dzielone ciężkie 2x2m – 135 zł (z karabińczykami ze stali nierdzewnej  160 zł)
lina bez karabińczyka lekka 3,6/4,5/6,7m – 90/100/120 zł
lina bez karabińczyka ciężka 3,6/4,5/6,7m – 120/130/160 zł
lina bez karabińczyka ciężka (Elana/multicolor) 3,6/4,5/6,7m – 145/155/185 zł
karabińczyk do liny mosiężny – 49 zł
cordeo – 80 zł

<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
Open modal for @mdo</button>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@fat">
Open modal for @fat</button>
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">
Open modal for @getbootstrap</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New message</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Send message</button>
      </div>
    </div>
  </div>
</div>

messanger
<!-- Messenger Wtyczka czatu Code -->

    <div id="fb-root"></div>

    <!-- Your Wtyczka czatu code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

    <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "105184195001412");
      chatbox.setAttribute("attribution", "biz_inbox");
    </script>

    <!-- Your SDK code -->
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v19.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/pl_PL/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>