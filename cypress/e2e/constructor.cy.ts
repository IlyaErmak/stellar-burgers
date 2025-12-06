describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим первую булку по тексту названия
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      // Находим первую начинку по тексту названия
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что начинка появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем наличие всех элементов
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (ссылку)
      cy.contains('Краторная булка N-200i').parent().parent().find('a').click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').parent().parent().find('a').click();
      cy.contains('Детали ингредиента').should('be.visible');

      // Закрываем через крестик (кнопка с CloseIcon)
      cy.get('button[type="button"]').last().click();
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').parent().parent().find('a').click();
      cy.contains('Детали ингредиента').should('be.visible');

      // Кликаем на оверлей (вне модального окна)
      cy.get('body').click(500, 100);
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен отображать данные выбранного ингредиента в модальном окне', () => {
      // Кликаем на начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('a')
        .click();

      // Проверяем содержимое модального окна
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Настраиваем перехват запросов ПЕРЕД загрузкой страницы
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      // Перехватываем запрос к /auth/user и возвращаем успешный ответ
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      }).as('getUser');
      cy.intercept('POST', '**/auth/token', {
        statusCode: 200,
        body: {
          success: true,
          refreshToken: 'new-refresh-token',
          accessToken: 'new-access-token'
        }
      }).as('refreshToken');
      // Перехватываем POST запросы к orders
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Краторный бургер',
          order: {
            _id: '64e8d45e82e277001bfaabc6',
            ingredients: [
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa0941',
              '643d69a5c3f7b9001cfa093c'
            ],
            status: 'done',
            name: 'Краторный бургер',
            createdAt: '2023-08-25T14:00:00.000Z',
            updatedAt: '2023-08-25T14:00:00.000Z',
            number: 12345
          }
        }
      }).as('createOrder');

      // Устанавливаем токены авторизации перед загрузкой страницы
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookies();
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      // Перезагружаем страницу, чтобы приложение проверило токен
      cy.visit('/');
      
      // Ждем загрузки ингредиентов
      cy.wait('@getIngredients');
      
      // Ждем загрузки пользователя (может быть несколько запросов из-за fetchWithRefresh)
      // Если токен валидный, будет один запрос. Если истек - запрос на обновление + повторный
      cy.wait('@getUser', { timeout: 10000 }).then((interception) => {
        // Проверяем, что запрос был успешно перехвачен
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body.success).to.equal(true);
        expect(interception.response?.body.user).to.exist;
      });

      // Даем время на обновление состояния Redux (нужно, чтобы isAuthChecked стал true и user установился)
      cy.wait(1500);

      // Проверяем, что мы не перенаправлены на страницу логина (значит пользователь авторизован)
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Дополнительная проверка - убеждаемся, что приложение готово
      cy.get('body').should('be.visible');

      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Убеждаемся, что кнопка "Оформить заказ" активна
      cy.contains('Оформить заказ').should('not.be.disabled');

      // Нажимаем кнопку "Оформить заказ"
      cy.contains('Оформить заказ').should('not.be.disabled').click();

      // Проверяем, что мы не перенаправлены на /login (значит пользователь авторизован)
      cy.url().should('not.include', '/login');

      // Ждем создания заказа (может быть задержка из-за обработки)
      cy.wait('@createOrder', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.equal(200);
        expect(interception.response?.body.success).to.equal(true);
        expect(interception.response?.body.order.number).to.equal(12345);
      });

      // Проверяем, что модальное окно открылось с номером заказа
      cy.contains('12345', { timeout: 5000 }).should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');

      // Закрываем модальное окно
      cy.get('button[type="button"]').last().click();

      // Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});

