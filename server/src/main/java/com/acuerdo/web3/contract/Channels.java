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
    private static final String BINARY = "0x60806040526040805190810160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152506005908051906020019061004f9291906100b0565b5034801561005c57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555066038d7ea4c68000600181905550610155565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100f157805160ff191683800117855561011f565b8280016001018555821561011f579182015b8281111561011e578251825591602001919060010190610103565b5b50905061012c9190610130565b5090565b61015291905b8082111561014e576000816000905550600101610136565b5090565b90565b611056806101646000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631df4ccfc1461009e57806369fe0e2d146100c957806377fec5c5146100f65780638da5cb5b1461014d578063b64150d9146101a4578063c4d252f514610216578063ddca3f4314610247578063fd745bce14610272578063fe607db7146102c0575b600080fd5b3480156100aa57600080fd5b506100b3610303565b6040518082815260200191505060405180910390f35b3480156100d557600080fd5b506100f460048036038101908080359060200190929190505050610309565b005b34801561010257600080fd5b5061012f60048036038101908080356000191690602001909291908035906020019092919050505061036e565b60405180826000191660001916815260200191505060405180910390f35b34801561015957600080fd5b5061016261040a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101b057600080fd5b506102146004803603810190808035600019169060200190929190803560ff1690602001909291908035600019169060200190929190803560001916906020019092919080356000191690602001909291908035906020019092919050505061042f565b005b34801561022257600080fd5b506102456004803603810190808035600019169060200190929190505050610a38565b005b34801561025357600080fd5b5061025c610c55565b6040518082815260200191505060405180910390f35b6102be6004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c5b565b005b3480156102cc57600080fd5b50610301600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f26565b005b60025481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561036457600080fd5b8060018190555050565b60008282604051602001808360001916600019168152602001828152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156103d557805182526020820191506020810190506020830392506103b0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020905092915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000806000806000600360008a600019166000191681526020019081526020016000209650600073ffffffffffffffffffffffffffffffffffffffff168760000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515156104b757600080fd5b8660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061056457508660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561056f57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff168760000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146105f0578660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610616565b8660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff165b95508660020154945084881115151561062e57600080fd5b60058d604051602001808380546001816001161561010002031660029004801561068f5780601f1061066d57610100808354040283529182019161068f565b820191906000526020600020905b81548152906001019060200180831161067b575b50508260001916600019168152602001925050506040516020818303038152906040526040518082805190602001908083835b6020831015156106e757805182526020820191506020810190506020830392506106c2565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902093506001848d8d8d604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af115801561078d573d6000803e3d6000fd5b5050506020604051035192508573ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415156107d357600080fd5b6107dd898961036e565b91508c600019168260001916141515610884576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260368152602001807f5369676e61747572652069732076616c69642062757420646f65736e2774206d81526020017f617463682074686520646174612070726f76696465640000000000000000000081525060400191505060405180910390fd5b87850390508660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc899081150290604051600060405180830381858888f193505050501580156108f3573d6000803e3d6000fd5b506000811115610969578660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610967573d6000803e3d6000fd5b505b600360008a60001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090556003820160009055505088600019167faee37d46ae7638649199a415cd6d49cc67df520cf2c80210daac017e0df3ab98828a604051808381526020018281526020019250505060405180910390a250505050505050505050505050565b60006003600083600019166000191681526020019081526020016000209050600073ffffffffffffffffffffffffffffffffffffffff168160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610ab757600080fd5b8060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b1557600080fd5b806003015442111515610b2757600080fd5b8060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600201549081150290604051600060405180830381858888f19350505050158015610b95573d6000803e3d6000fd5b50600360008360001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160009055600382016000905550507f91654f87374441c7815bdc817e86a33913837f466f0a5950adfa04af14a032428260405180826000191660001916815260200191505060405180910390a15050565b60015481565b610c63610fd5565b600073ffffffffffffffffffffffffffffffffffffffff1660036000866000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610d6b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001807f4368616e6e656c2077697468207468652073616d65206368616e6e656c49642081526020017f616c7265616479206578697374732e000000000000000000000000000000000081525060400191505060405180910390fd5b6080604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1681526020016001543403815260200183420181525090508060036000866000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015560608201518160030155905050600154600260008282540192505081905550806020015173ffffffffffffffffffffffffffffffffffffffff16816000015173ffffffffffffffffffffffffffffffffffffffff1685600019167f705401abfacf8fad9792d847e80f9f3f7c367ab3244281e27961807ec2df6ad38460400151856060015160015460405180848152602001838152602001828152602001935050505060405180910390a450505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f8157600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f19350505050158015610fc9573d6000803e3d6000fd5b50600060028190555050565b608060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016000815250905600a165627a7a723058209ac56ce12048dfd92f4997552614f9be80e9faf464e67dae4c89106cc33492cb0029";

    public static final String FUNC_TOTALFEE = "totalFee";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_FEE = "fee";

    public static final String FUNC_SETFEE = "setFee";

    public static final String FUNC_WITHDRAWTOTALFEE = "withdrawTotalFee";

    public static final String FUNC_OPEN = "open";

    public static final String FUNC_CLOSE = "close";

    public static final String FUNC_CANCEL = "cancel";

    public static final String FUNC_GETPAYMENTID = "getPaymentId";

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
        _addresses.put("4447", "0x93513d5b626ab3922ca4dcf06465921eafdaadd9");
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

    public RemoteCall<byte[]> getPaymentId(byte[] channelId, BigInteger value) {
        final Function function = new Function(FUNC_GETPAYMENTID, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Bytes32(channelId), 
                new org.web3j.abi.datatypes.generated.Uint256(value)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
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
