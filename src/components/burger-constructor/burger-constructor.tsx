import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { Modal } from '../modal';
import { OrderDetailsUI } from '@ui';
import { Preloader } from '../ui/preloader';
import {
  selectBun,
  selectConstructorIngredients,
  selectConstructorTotal
} from '@selectors';
import { selectOrder, selectOrderLoading } from '@selectors';
import { createOrder, clearOrder } from '@slices';
import { selectIsAuthenticated } from '@selectors';
import { clearConstructor } from '@slices';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const price = useSelector(selectConstructorTotal);
  const order = useSelector(selectOrder);
  const orderRequest = useSelector(selectOrderLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...(ingredients || []).map((ing: TConstructorIngredient) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={order}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderRequest && (
        <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
          <Preloader />
        </Modal>
      )}
      {order && !orderRequest && (
        <Modal onClose={closeOrderModal} title=''>
          <OrderDetailsUI orderNumber={order.number} />
        </Modal>
      )}
    </>
  );
};
