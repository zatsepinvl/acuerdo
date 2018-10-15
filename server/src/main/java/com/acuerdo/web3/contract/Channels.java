package com.acuerdo.web3.contract;

import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import rx.Observable;
import rx.functions.Func1;

import java.math.BigInteger;
import java.util.*;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 3.6.0.
 */
public class Channels extends Contract {
    private static final String BINARY = "0x60806040526040805190810160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152506005908051906020019062000051929190620000b4565b503480156200005f57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555066038d7ea4c6800060018190555062000163565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620000f757805160ff191683800117855562000128565b8280016001018555821562000128579182015b82811115620001275782518255916020019190600101906200010a565b5b5090506200013791906200013b565b5090565b6200016091905b808211156200015c57600081600090555060010162000142565b5090565b90565b61142780620001736000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631df4ccfc146100a95780633a212794146100d457806369fe0e2d146101375780638da5cb5b14610164578063b64150d9146101bb578063b75f18611461022d578063c4d252f514610272578063ddca3f43146102a3578063fd745bce146102ce578063fe607db71461031c575b600080fd5b3480156100b557600080fd5b506100be61035f565b6040518082815260200191505060405180910390f35b3480156100e057600080fd5b5061013560048036038101908080604001909192919290806040019091929192908060400190919291929080604001909192919290803560001916906020019092919080359060200190929190505050610365565b005b34801561014357600080fd5b506101626004803603810190808035906020019092919050505061043f565b005b34801561017057600080fd5b506101796104a4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101c757600080fd5b5061022b6004803603810190808035600019169060200190929190803560ff169060200190929190803560001916906020019092919080356000191690602001909291908035600019169060200190929190803590602001909291905050506104c9565b005b34801561023957600080fd5b5061027060048036038101908080356000191690602001909291908035906020019092919080359060200190929190505050610b9f565b005b34801561027e57600080fd5b506102a16004803603810190808035600019169060200190929190505050610e10565b005b3480156102af57600080fd5b506102b861102e565b6040518082815260200191505060405180910390f35b61031a6004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611034565b005b34801561032857600080fd5b5061035d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506112ff565b005b60025481565b6103ce86600060028110151561037757fe5b60200201356000191686600060028110151561038f57fe5b602002013560ff168560006002811015156103a657fe5b6020020135600019168760006002811015156103be57fe5b60200201356000191686866104c9565b6104378660016002811015156103e057fe5b6020020135600019168660016002811015156103f857fe5b602002013560ff1685600160028110151561040f57fe5b60200201356000191687600160028110151561042757fe5b60200201356000191686866104c9565b505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561049a57600080fd5b8060018190555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000806000806003600089600019166000191681526020019081526020016000209550600073ffffffffffffffffffffffffffffffffffffffff168660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415151561054f57600080fd5b8560020154945084871115151561056557600080fd5b60058c60405160200180838054600181600116156101000203166002900480156105c65780601f106105a45761010080835404028352918201916105c6565b820191906000526020600020905b8154815290600101906020018083116105b2575b50508260001916600019168152602001925050506040516020818303038152906040526040518082805190602001908083835b60208310151561061e57805182526020820191506020810190506020830392506105f9565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902093506001848c8c8c604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af11580156106c4573d6000803e3d6000fd5b5050506020604051035192508560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16148061077d57508560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b151561078857600080fd5b8787604051602001808360001916600019168152602001828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156107ed57805182526020820191506020810190506020830392506107c8565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902091508b6000191682600019161415156108c1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260368152602001807f5369676e61747572652069732076616c69642062757420646f65736e2774206d81526020017f617463682074686520646174612070726f76696465640000000000000000000081525060400191505060405180910390fd5b600060046000846000191660001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561097a578260046000846000191660001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610b91565b8273ffffffffffffffffffffffffffffffffffffffff1660046000846000191660001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610b905786850390508560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc889081150290604051600060405180830381858888f19350505050158015610a59573d6000803e3d6000fd5b506000811115610acf578560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610acd573d6000803e3d6000fd5b505b600360008960001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090556003820160009055505087600019167faee37d46ae7638649199a415cd6d49cc67df520cf2c80210daac017e0df3ab988289604051808381526020018281526020019250505060405180910390a25b5b505050505050505050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610bfc57600080fd5b6003600085600019166000191681526020019081526020016000209050600073ffffffffffffffffffffffffffffffffffffffff168160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610c7957600080fd5b8060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f19350505050158015610ce3573d6000803e3d6000fd5b508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015610d4e573d6000803e3d6000fd5b50600360008560001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160009055600382016000905550507f8cabed1b1759b5e6de54f5dc84d902088fb07946daf821511328fff2fb27e57a8460405180826000191660001916815260200191505060405180910390a150505050565b60006003600083600019166000191681526020019081526020016000209050600073ffffffffffffffffffffffffffffffffffffffff168160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610e8f57600080fd5b8060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610eed57600080fd5b42816003015411151515610f0057600080fd5b8060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600201549081150290604051600060405180830381858888f19350505050158015610f6e573d6000803e3d6000fd5b50600360008360001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160009055600382016000905550507f91654f87374441c7815bdc817e86a33913837f466f0a5950adfa04af14a032428260405180826000191660001916815260200191505060405180910390a15050565b60015481565b61103c6113a6565b600073ffffffffffffffffffffffffffffffffffffffff1660036000866000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515611144576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4368616e6e656c2077697468207468652073616d65206368616e6e656c49642081526020017f616c7265616479206578697374732e000000000000000000000000000000000081525060400191505060405180910390fd5b6080604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1681526020016001543403815260200183420181525090508060036000866000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015560608201518160030155905050600154600260008282540192505081905550806020015173ffffffffffffffffffffffffffffffffffffffff16816000015173ffffffffffffffffffffffffffffffffffffffff1685600019167f705401abfacf8fad9792d847e80f9f3f7c367ab3244281e27961807ec2df6ad38460400151856060015160015460405180848152602001838152602001828152602001935050505060405180910390a450505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561135a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f193505050501580156113a2573d6000803e3d6000fd5b5050565b608060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016000815250905600a165627a7a72305820c3d442001af185ee5efdc7b6a9caeccf921c5677d8dece5ccaf0ee8ffb61c38b0029";

    public static final String FUNC_TOTALFEE = "totalFee";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_FEE = "fee";

    public static final String FUNC_SETFEE = "setFee";

    public static final String FUNC_WITHDRAWTOTALFEE = "withdrawTotalFee";

    public static final String FUNC_OPEN = "open";

    public static final String FUNC_CLOSEBYALL = "closeByAll";

    public static final String FUNC_CLOSE = "close";

    public static final String FUNC_CANCEL = "cancel";

    public static final String FUNC_RESOLVEDISPUTE = "resolveDispute";

    public static final Event CHANNELOPENED_EVENT = new Event("ChannelOpened", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event CHANNELCLOSED_EVENT = new Event("ChannelClosed", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event CHANNELCLOSEDBYDISPUTE_EVENT = new Event("ChannelClosedByDispute", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
    ;

    public static final Event CHANNELCANCELED_EVENT = new Event("ChannelCanceled", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
    ;

    protected static final HashMap<String, String> _addresses;

    static {
        _addresses = new HashMap<String, String>();
        _addresses.put("4447", "0x5C7FF5F07cc3A21725eBFDD6a8A1710d75fde85C");
    }

    @Deprecated
    protected Channels(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Channels(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Channels(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Channels(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteCall<BigInteger> totalFee() {
        final Function function = new Function(FUNC_TOTALFEE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<String> owner() {
        final Function function = new Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<BigInteger> fee() {
        final Function function = new Function(FUNC_FEE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public static RemoteCall<Channels> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Channels.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    public static RemoteCall<Channels> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(Channels.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Channels> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Channels.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<Channels> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Channels.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public List<ChannelOpenedEventResponse> getChannelOpenedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(CHANNELOPENED_EVENT, transactionReceipt);
        ArrayList<ChannelOpenedEventResponse> responses = new ArrayList<ChannelOpenedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ChannelOpenedEventResponse typedResponse = new ChannelOpenedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.channelId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.sender = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.recipient = (String) eventValues.getIndexedValues().get(2).getValue();
            typedResponse.value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.canCanceledAt = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.feePayed = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<ChannelOpenedEventResponse> channelOpenedEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, ChannelOpenedEventResponse>() {
            @Override
            public ChannelOpenedEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(CHANNELOPENED_EVENT, log);
                ChannelOpenedEventResponse typedResponse = new ChannelOpenedEventResponse();
                typedResponse.log = log;
                typedResponse.channelId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.sender = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse.recipient = (String) eventValues.getIndexedValues().get(2).getValue();
                typedResponse.value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.canCanceledAt = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                typedResponse.feePayed = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<ChannelOpenedEventResponse> channelOpenedEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CHANNELOPENED_EVENT));
        return channelOpenedEventObservable(filter);
    }

    public List<ChannelClosedEventResponse> getChannelClosedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(CHANNELCLOSED_EVENT, transactionReceipt);
        ArrayList<ChannelClosedEventResponse> responses = new ArrayList<ChannelClosedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ChannelClosedEventResponse typedResponse = new ChannelClosedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.channelId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.refundToSender = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.releasedToRecipient = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<ChannelClosedEventResponse> channelClosedEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, ChannelClosedEventResponse>() {
            @Override
            public ChannelClosedEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(CHANNELCLOSED_EVENT, log);
                ChannelClosedEventResponse typedResponse = new ChannelClosedEventResponse();
                typedResponse.log = log;
                typedResponse.channelId = (byte[]) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.refundToSender = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.releasedToRecipient = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<ChannelClosedEventResponse> channelClosedEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CHANNELCLOSED_EVENT));
        return channelClosedEventObservable(filter);
    }

    public List<ChannelClosedByDisputeEventResponse> getChannelClosedByDisputeEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(CHANNELCLOSEDBYDISPUTE_EVENT, transactionReceipt);
        ArrayList<ChannelClosedByDisputeEventResponse> responses = new ArrayList<ChannelClosedByDisputeEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ChannelClosedByDisputeEventResponse typedResponse = new ChannelClosedByDisputeEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.channelId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<ChannelClosedByDisputeEventResponse> channelClosedByDisputeEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, ChannelClosedByDisputeEventResponse>() {
            @Override
            public ChannelClosedByDisputeEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(CHANNELCLOSEDBYDISPUTE_EVENT, log);
                ChannelClosedByDisputeEventResponse typedResponse = new ChannelClosedByDisputeEventResponse();
                typedResponse.log = log;
                typedResponse.channelId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<ChannelClosedByDisputeEventResponse> channelClosedByDisputeEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CHANNELCLOSEDBYDISPUTE_EVENT));
        return channelClosedByDisputeEventObservable(filter);
    }

    public List<ChannelCanceledEventResponse> getChannelCanceledEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(CHANNELCANCELED_EVENT, transactionReceipt);
        ArrayList<ChannelCanceledEventResponse> responses = new ArrayList<ChannelCanceledEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ChannelCanceledEventResponse typedResponse = new ChannelCanceledEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.channelId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<ChannelCanceledEventResponse> channelCanceledEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, ChannelCanceledEventResponse>() {
            @Override
            public ChannelCanceledEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(CHANNELCANCELED_EVENT, log);
                ChannelCanceledEventResponse typedResponse = new ChannelCanceledEventResponse();
                typedResponse.log = log;
                typedResponse.channelId = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<ChannelCanceledEventResponse> channelCanceledEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CHANNELCANCELED_EVENT));
        return channelCanceledEventObservable(filter);
    }

    public RemoteCall<TransactionReceipt> setFee(BigInteger _fee) {
        final Function function = new Function(
                FUNC_SETFEE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_fee)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> withdrawTotalFee(String to) {
        final Function function = new Function(
                FUNC_WITHDRAWTOTALFEE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(to)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> open(byte[] channelId, String recipient, BigInteger timeout, BigInteger weiValue) {
        final Function function = new Function(
                FUNC_OPEN, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(channelId), 
                new org.web3j.abi.datatypes.Address(recipient), 
                new org.web3j.abi.datatypes.generated.Uint256(timeout)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function, weiValue);
    }

    public RemoteCall<TransactionReceipt> closeByAll(List<byte[]> h, List<BigInteger> v, List<byte[]> r, List<byte[]> s, byte[] channelId, BigInteger value) {
        final Function function = new Function(
                FUNC_CLOSEBYALL, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.StaticArray2<org.web3j.abi.datatypes.generated.Bytes32>(
                        org.web3j.abi.Utils.typeMap(h, org.web3j.abi.datatypes.generated.Bytes32.class)), 
                new org.web3j.abi.datatypes.generated.StaticArray2<org.web3j.abi.datatypes.generated.Uint8>(
                        org.web3j.abi.Utils.typeMap(v, org.web3j.abi.datatypes.generated.Uint8.class)), 
                new org.web3j.abi.datatypes.generated.StaticArray2<org.web3j.abi.datatypes.generated.Bytes32>(
                        org.web3j.abi.Utils.typeMap(r, org.web3j.abi.datatypes.generated.Bytes32.class)), 
                new org.web3j.abi.datatypes.generated.StaticArray2<org.web3j.abi.datatypes.generated.Bytes32>(
                        org.web3j.abi.Utils.typeMap(s, org.web3j.abi.datatypes.generated.Bytes32.class)), 
                new org.web3j.abi.datatypes.generated.Bytes32(channelId), 
                new org.web3j.abi.datatypes.generated.Uint256(value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> close(byte[] h, BigInteger v, byte[] r, byte[] s, byte[] channelId, BigInteger value) {
        final Function function = new Function(
                FUNC_CLOSE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(h), 
                new org.web3j.abi.datatypes.generated.Uint8(v), 
                new org.web3j.abi.datatypes.generated.Bytes32(r), 
                new org.web3j.abi.datatypes.generated.Bytes32(s), 
                new org.web3j.abi.datatypes.generated.Bytes32(channelId), 
                new org.web3j.abi.datatypes.generated.Uint256(value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> cancel(byte[] channelId) {
        final Function function = new Function(
                FUNC_CANCEL, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(channelId)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> resolveDispute(byte[] channelId, BigInteger amountToSender, BigInteger amountToRecipient) {
        final Function function = new Function(
                FUNC_RESOLVEDISPUTE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(channelId), 
                new org.web3j.abi.datatypes.generated.Uint256(amountToSender), 
                new org.web3j.abi.datatypes.generated.Uint256(amountToRecipient)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static Channels load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Channels(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Channels load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Channels(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Channels load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new Channels(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Channels load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Channels(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    protected String getStaticDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static String getPreviouslyDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static class ChannelOpenedEventResponse {
        public Log log;

        public byte[] channelId;

        public String sender;

        public String recipient;

        public BigInteger value;

        public BigInteger canCanceledAt;

        public BigInteger feePayed;
    }

    public static class ChannelClosedEventResponse {
        public Log log;

        public byte[] channelId;

        public BigInteger refundToSender;

        public BigInteger releasedToRecipient;
    }

    public static class ChannelClosedByDisputeEventResponse {
        public Log log;

        public byte[] channelId;
    }

    public static class ChannelCanceledEventResponse {
        public Log log;

        public byte[] channelId;
    }
}
