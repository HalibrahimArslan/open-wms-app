import { Routes, Route } from 'react-router'
import usePersistedToken from '../hooks/usePersistedToken.js'
import DepoListView from '../view/DepoList/DepoListView.jsx'
import KontrolAdres from '../container/KontrolAdres/KontrolAdres.jsx'
import FirmListDetail from '../container/Receiving/FirmadanMalKabul/FirmListDetail'
import UserDispatchedOrder from '../container/Sevk/SevkiyatOrder/UserDispatchedOrder.jsx'
import PlacementHistory from '../container/Placement-History/PlacementHistory.jsx'
import ReceivingView from '../view/MalKabul/ReceivingView.jsx'
import DepolarArasiTransferView from '../view/DepolarArasiTransfer/DepolarArasiTransferView.jsx'
import OrderCombineContainer from '../container/Sevk/Waybill/OrderCombineContainer.jsx'
import PalletBarcodeView from '../view/PalletBarcode/PalletBarcodeView.jsx'
import OrderTracingView from '../view/OrderTracing/OrderTracingView.jsx'
import PalletBarcodeDetailView from '../view/PalletBarcode/PalletBarcodeDetailView.jsx'
import Guard from '../shared/auth/Guard.jsx'
import OrderDetailById from '../container/Order-Edit/OrderDetailById.jsx'
import OrderEditView from '../view/Order-Edit/OrderEditView.jsx'
import CountingDefinitionView from '../view/Counting/CountingDefinitionView.jsx'
import Dashboard from '../container/Dashboard/DashboardContainer.jsx'
import AddressView from '../view/Address/AddressView.jsx'
import CountingProcessView from '../view/Counting/CountingProcessView.jsx'
import UsersView from '../view/Users/UsersView.jsx'
import CreateUserView from '../view/Users/CreateUserView.jsx'
import EditUserView from '../view/Users/EditUserView.jsx'
import DefinitionView from '../view/Definitions/DefinitionView.jsx'
import RoleView from '../view/Definitions/Role-Definition/RoleView.jsx'
import CreateRoleView from '../view/Definitions/Role-Definition/CreateRoleView.jsx'
import UserRolesView from '../view/Definitions/User-Role-Relation/UserRolesView.jsx'
import CreateUserRoleView from '../view/Definitions/User-Role-Relation/CreateUsersRoleView.jsx'
import MenuRoleRelationView from '../view/Definitions/Role-Menu-Relation/MenuRoleRelationView.jsx'
import ProfileView from '../view/Profile/ProfileView.jsx'
import UserInformationView from '../view/Profile/UserInformationView.jsx'
import NotificationsView from '../view/Profile/NotificationsView.jsx'
import MovementView from '../view/Profile/MovementView.jsx'
import DemandsView from '../view/Profile/DemandsView.jsx'
import PartialItemView from '../view/PartialItem/PartialItemView.jsx'
import CompleteDispatchmentView from '../view/Dispatchment/CompleteDispatchment/CompleteDispatchmentView.jsx'
import OrdersToBeDispatchedView from '../view/Dispatchment/OrdersToBeDispatched/OrdersToBeDispatchedView.jsx'
import AssignedDispatchmentView from '../view/Dispatchment/AssignedDispatchment/AssignedDispatchmentView.jsx'
import MailView from '../view/Definitions/Mail-Definition/MailView.jsx'
import RulesView from '../view/Definitions/Rule-Definition/RulesView.jsx'
import MenuView from '../view/Menu/MenuView.jsx'
import MenuDefinitionView from '../view/Definitions/Menu-Definition/MenuDefinitionView.jsx'
import CreateMenuView from '../view/Definitions/Menu-Definition/CreateMenuView.jsx'
import FeedbackManagementView from '../view/Feedback/FeedbackManagementView.jsx'
import FeedbackDetailView from '../view/Feedback/FeedbackDetail/FeedbackDetailView.jsx'
import FirmsView from '../view/Firms/FirmsView.jsx'
import OrderDetailView from '../view/Dispatchment/OrderDetail/OrderDetailView.jsx'
import ReceivingFirmsView from '../view/Receiving/ReceivingFirmsView.jsx'
import CountingPickingView from '../view/Counting/CountingPickingView.jsx'
import CsvUploadView from '../view/Dispatchment/DispatchmentPlanUpload/CsvUploadView.jsx'
import AddressDefinitionView from '../view/Address/Definition/AddressDefinitionView.jsx'
import AddressDepartmentView from '../view/Address/Definition/AddressDepartmentView.jsx'
import AddressHallView from '../view/Address/Definition/AddressHallView.jsx'
import AddressUnitView from '../view/Address/Definition/AddressUnitView.jsx'
import AddressFlatView from '../view/Address/Definition/AddressFlatView.jsx'
import AddressRoomView from '../view/Address/Definition/AddressRoomView.jsx'
import AddressTypeView from '../view/Address/Definition/AddressTypeView.jsx'
import PageNotFound from '../shared/components/PageNotFound/PageNotFound.jsx'
import ProductAddressDefinitionView from '../view/Address/Operation/ProductAddressDefinitionView.jsx'
import ProductAddressReplacementView from '../view/Address/Operation/ProductAddressReplacementView.jsx'
import ReplacementFromTemporaryAddressView from '../view/Address/Operation/ReplacementFromTemporaryAddressView.jsx'
import ProductAddressOperationView from '../view/Product-address-operations/ProductAddressOperationView.jsx'
import DriverDefinitionView from '../view/Definitions/Driver-Definiton/DriverDefinitionView.jsx'
import ReserveProductDefinitionView from '../view/Definitions/ReserveProduct/ReserveProductDefinitionView.jsx'
import PerformanceControl from '../view/Performance-Contol/PerformanceControl.jsx'
import MicroReport from '../view/Micro/MicroReport.jsx'
import WaybillControlView from '../view/WaybillControl/WaybillControlView.jsx'
import UniqueBarcodeFirmsView from '../view/UniqueBarcode/UniqueBarcodeFirmsView.jsx'
import UniqueBarcodeFirmListDetail from '../container/UniqueBarcode/FirmadanMalKabul/UniqueBarcodeFirmListDetail'
import UniqueBarcodeView from '../view/UniqueBarcode/UniqueBarcodeView.jsx'
import LotProductDefinitionView from '../view/UniqueBarcode/LotProductDefinitionView.jsx'

export default function AppWithState() {
  usePersistedToken()

  return (
    <Guard>
      <Routes>
        <Route path="/" element={<DepoListView />} />
        <Route path="/:depo" element={<MenuView />}></Route>
        <Route path="/:depo/performance-control" element={<PerformanceControl />} />
        <Route path="/:depo/waybill-control" element={<WaybillControlView />} />
        <Route path="/:depo/dashboard" element={<Dashboard />}>
          <Route path=":palletbarcode/detail" element={<PalletBarcodeDetailView />} />
        </Route>
        <Route path="/:depo/feedbacks" element={<FeedbackManagementView />} />
        <Route path="/:depo/feedbacks/:id" element={<FeedbackDetailView />} />
        <Route path="/:depo/users" element={<UsersView />} />
        <Route path="/:depo/users/new" element={<CreateUserView />} />
        <Route path="/:depo/users/edit" element={<EditUserView />} />
        <Route path="/:depo/csv-upload" element={<CsvUploadView />} />
        <Route path="/:depo/definitions" element={<DefinitionView />}>
          <Route path="mails" element={<MailView />} />
          <Route path="menus" element={<MenuDefinitionView />}>
            <Route path="new" element={<CreateMenuView />} />
          </Route>
          <Route path="rules" element={<RulesView />} />
          <Route path="role-definitions" element={<RoleView />}>
            <Route path="new" element={<CreateRoleView />} />
          </Route>
          <Route path="user-role-definitions" element={<UserRolesView />}>
            <Route path="new" element={<CreateUserRoleView />} />
          </Route>
          <Route path="role-menu-definitions" element={<MenuRoleRelationView />} />
          <Route path="driver-definitions" element={<DriverDefinitionView />} />
          <Route path="reserve-products" element={<ReserveProductDefinitionView />} />
        </Route>
        <Route path="/:depo/address-tanim" element={<AddressDefinitionView />}>
          <Route path="department" element={<AddressDepartmentView />} />
          <Route path="hall" element={<AddressHallView />} />
          <Route path="unit" element={<AddressUnitView />} />
          <Route path="flat" element={<AddressFlatView />} />
          <Route path="room" element={<AddressRoomView />} />
          <Route path="address-type" element={<AddressTypeView />} />
        </Route>
        <Route path="/:depo/:menuId/cari-selection" element={<FirmsView />} />
        <Route path="/:depo/depolararasitransfer" element={<DepolarArasiTransferView />} />
        <Route path="/:depo/:menuId/:cariCode/orderprogresssevkiyat" element={<OrderDetailView />} />
        <Route path="/:depo/:menuId/:firmName/:firmCode/:cariBaglantiTipi/:bolgeKodu/orderprogresssevkiyat" element={<OrderDetailView />} />
        <Route path="/:depo/:menuId/firmlist" element={<ReceivingFirmsView />} />
        <Route path="/:depo/:menuId/:firmName/:firmCode/firmListDetail" element={<FirmListDetail />} />
        <Route path="/:depo/:menuId/unique-barcode-firmlist" element={<UniqueBarcodeFirmsView />} />
        <Route path="/:depo/lot-product-definition" element={<LotProductDefinitionView />} />
        <Route path="/:depo/:menuId/:firmName/:firmCode/unique-barcode-firmListDetail" element={<UniqueBarcodeFirmListDetail />} />
        <Route path="/:depo/profile" element={<ProfileView />}>
          <Route path="user-informations" element={<UserInformationView />} />
          <Route path="notifications" element={<NotificationsView />} />
          <Route path="movements" element={<MovementView />} />
          <Route path="demands" element={<DemandsView />} />
        </Route>
        <Route path="/:depo/address" element={<AddressView />} />
        <Route path="/:depo/partial-item" element={<PartialItemView />} />
        <Route path="/:depo/kontroladres" element={<KontrolAdres />} />
        <Route path="/:depo/:menuId/:opType/:orderInfo/:firmCode/:firmName/orderprogressfinish" element={<ReceivingView />} />
        <Route path="/:depo/:menuId/:opType/:orderInfo/:firmCode/:firmName/unique-barcode-orderprogressfinish" element={<UniqueBarcodeView />} />
        <Route path="/:depo/dispatchingorder" element={<UserDispatchedOrder />} />
        <Route path="/:depo/:orderType/orders-to-be-dispatched" element={<OrdersToBeDispatchedView />} />
        <Route path="/:depo/:orderType/:orderInfo/complete-dispatchment" element={<CompleteDispatchmentView />}>
          <Route path="irsaliye" element={<OrderCombineContainer />} />
          <Route path=":palletbarcode/detail" element={<PalletBarcodeDetailView />} />
        </Route>
        <Route path="/:depo/palletbarcode" element={<PalletBarcodeView />}>
          <Route path=":palletbarcode/detail" element={<PalletBarcodeDetailView />} />
        </Route>
        <Route path="/:depo/counting" element={<CountingPickingView />} />
        <Route path="/:depo/counting/:countingId" element={<CountingProcessView />} />
        <Route path="/:depo/counting-definition" element={<CountingDefinitionView />} />

        <Route path="/:depo/ordertracing/:status?" element={<OrderTracingView />} />
        <Route path="/:depo/placementhistory/:filters?" element={<PlacementHistory />} />
        <Route path="/:depo/:firmCode/:orderType/:cariBaglantiTipi/:cariCode/:orderNo/orderdetailsuspend" element={<OrderEditView />}>
          <Route path="order-detail/:orderId" element={<OrderDetailById />} />
        </Route>
        <Route path="/:depo/:orderType/:orderNumber/assigned-dispatchment" element={<AssignedDispatchmentView />} />
        <Route path="/:depo/productaddressreplacement" element={<ProductAddressReplacementView />} />
        <Route path="/:depo/productplacement" element={<ReplacementFromTemporaryAddressView />} />
        <Route path="/:depo/productaddressdef" element={<ProductAddressDefinitionView />} />
        <Route path="/:depo/address-operations" element={<ProductAddressOperationView />} />
        <Route path="/:depo/report" element={<MicroReport />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Guard>
  )
}
