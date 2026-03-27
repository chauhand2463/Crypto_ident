import * as snarkjs from 'snarkjs';
import { getRegistryContract } from './identity.service';

const formatCalldata = (proof, publicSignals) => {
    return {
        a: [proof.pi_a[0], proof.pi_a[1]],
        b: [
            [proof.pi_b[0][1], proof.pi_b[0][0]],
            [proof.pi_b[1][1], proof.pi_b[1][0]]
        ],
        c: [proof.pi_c[0], proof.pi_c[1]],
        input: publicSignals
    };
};

export const proveOnChain = async (type, inputs) => {
    let circuitName = '';
    let methodName = '';

    switch (type) {
        case 'AGE':
            circuitName = 'age_verification';
            methodName = 'verifyAge';
            break;
        case 'NATIONALITY':
            circuitName = 'nationality_verification';
            methodName = 'verifyNationality';
            break;
        case 'UNIVERSITY':
            circuitName = 'student_verification';
            methodName = 'verifyStudent';
            break;
        default:
            throw new Error(`UNKNOWN_PROOF_TYPE: ${type}`);
    }

    const wasmPath = `/circuits/${circuitName}/${circuitName}.wasm`;
    const zkeyPath = `/circuits/${circuitName}/${circuitName}.zkey`;

    try {
        console.log(`[PROOF] Generating ${type} proof...`);
        console.log(`[PROOF] Inputs:`, JSON.stringify(inputs, null, 2));

        // Generate proof
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            inputs,
            wasmPath,
            zkeyPath
        );

        console.log(`[PROOF] Generated successfully`);
        console.log(`[PROOF] Public signals:`, publicSignals);

        // Submit to blockchain (this costs gas)
        console.log(`[PROOF] Submitting to blockchain...`);
        const registry = await getRegistryContract(false);
        const callData = formatCalldata(proof, publicSignals);

        const tx = await registry[methodName](
            callData.a,
            callData.b,
            callData.c,
            callData.input
        );

        console.log(`[PROOF] Transaction submitted:`, tx.hash);
        
        await tx.wait();
        
        console.log(`[PROOF] Confirmed:`, tx.hash);
        return tx.hash;
    } catch (error) {
        console.error(`[PROOF] Error:`, error);
        throw error;
    }
};
